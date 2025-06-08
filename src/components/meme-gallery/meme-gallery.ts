import { getMemes } from '../../services/storage';
import { Meme } from '../../types';

class MemeGallery extends HTMLElement {
    private sortSelect!: HTMLSelectElement;
    private galleryContainer!: HTMLDivElement;
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.initElements();
      this.setupEventListeners();
      this.loadMemes();
    }
  
    private render() {
      this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: block;
            margin: 0;
            width: 100%;
          }
          .gallery-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 0 10px;
          }
          .gallery-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2px;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .meme-item {
            cursor: pointer;
            width: 100%;
            height: 200px;
            overflow: hidden;
          }
          .meme-item:hover {
            opacity: 0.9;
          }
          .meme-item img, .meme-item video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }
          select {
            padding: 5px 10px;
            border: 1px solid #ddd;
          }
          h2 {
            font-size: 24px;
            margin: 0;
          }
        </style>
        <div class="gallery-header">
          <h2>Galería de Memes</h2>
          <select>
            <option value="newest">Más recientes primero</option>
            <option value="oldest">Más antiguos primero</option>
            <option value="random">Aleatorio</option>
          </select>
        </div>
        <div class="gallery-container"></div>
      `;
    }
  
    private initElements() {
      this.sortSelect = this.shadowRoot!.querySelector('select')!;
      this.galleryContainer = this.shadowRoot!.querySelector('.gallery-container')!;
    }
  
    private setupEventListeners() {
      this.sortSelect.addEventListener('change', () => this.loadMemes());
      document.addEventListener('memes-uploaded', () => this.loadMemes());
    }
  
    private async loadMemes() {
      this.galleryContainer.innerHTML = '<p>Cargando memes...</p>';
      
      try {
        const memes = await getMemes();
        if (memes.length === 0) {
          this.galleryContainer.innerHTML = '<p>No hay memes todavía. ¡Sé el primero en subir uno!</p>';
          return;
        }
  
        const sortMethod = this.sortSelect.value;
        let sortedMemes = [...memes];
        
        if (sortMethod === 'newest') {
          sortedMemes.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortMethod === 'oldest') {
          sortedMemes.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortMethod === 'random') {
          sortedMemes = sortedMemes.sort(() => Math.random() - 0.5);
        }
  
        this.renderMemes(sortedMemes);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        this.galleryContainer.innerHTML = `<p>Error al cargar memes: ${errorMessage}</p>`;
      }
    }
  
    private renderMemes(memes: Meme[]) {
      this.galleryContainer.innerHTML = '';
      
      memes.forEach(meme => {
        const memeItem = document.createElement('div');
        memeItem.className = 'meme-item';
        
        const isVideo = meme.name.endsWith('.mp4') || meme.name.endsWith('.webm');
        
        if (isVideo) {
          const video = document.createElement('video');
          video.src = meme.url;
          video.muted = true;
          video.autoplay = true;
          video.loop = true;
          memeItem.appendChild(video);
        } else {
          const img = document.createElement('img');
          img.src = meme.url;
          img.alt = 'Meme';
          memeItem.appendChild(img);
        }
        
        memeItem.addEventListener('click', () => this.showMemeDetail(meme));
        this.galleryContainer.appendChild(memeItem);
      });
    }
  
    private showMemeDetail(meme: Meme) {
      const event = new CustomEvent('meme-selected', {
        detail: meme,
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    }
  }
  
  customElements.define('meme-gallery', MemeGallery);