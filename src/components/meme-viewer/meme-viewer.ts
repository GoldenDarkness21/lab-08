import { Meme } from '../../types';

class MemeViewer extends HTMLElement {
    private overlay!: HTMLDivElement;
    private content!: HTMLDivElement;
    private closeButton!: HTMLButtonElement;
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.initElements();
      this.setupEventListeners();
      this.hide();
    }
  
    private render() {
      this.shadowRoot!.innerHTML = `
        <style>
          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            z-index: 1000;
          }
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
          }
          .content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          .content img, .content video {
            max-width: 100%;
            max-height: 80vh;
            display: block;
          }
          .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff4444;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            z-index: 1001;
          }
        </style>
        <div class="overlay"></div>
        <div class="content">
          <button class="close-btn">×</button>
        </div>
      `;
    }
  
    private initElements() {
      this.overlay = this.shadowRoot!.querySelector('.overlay')!;
      this.content = this.shadowRoot!.querySelector('.content')!;
      this.closeButton = this.shadowRoot!.querySelector('.close-btn')!;
    }
  
    private setupEventListeners() {
      this.overlay.addEventListener('click', () => this.hide());
      this.closeButton.addEventListener('click', () => this.hide());
      
      // Escucha eventos de la galería
      document.addEventListener('meme-selected', ((e: CustomEvent<Meme>) => {
        this.showMeme(e.detail);
      }) as EventListener);
    }
  
    private showMeme(meme: Meme) {
      this.content.innerHTML = '<button class="close-btn">×</button>';
      
      const isVideo = meme.name.endsWith('.mp4') || meme.name.endsWith('.webm');
      
      if (isVideo) {
        const video = document.createElement('video');
        video.src = meme.url;
        video.controls = true;
        video.autoplay = true;
        this.content.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = meme.url;
        img.alt = 'Meme ampliado';
        this.content.appendChild(img);
      }
      
      this.show();
    }
  
    private show() {
      this.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  
    private hide() {
      this.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  customElements.define('meme-viewer', MemeViewer);
  