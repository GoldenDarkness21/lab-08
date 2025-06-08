import { uploadMeme } from '../../services/storage';
import { UploadResult } from '../../types';

class MemeUploader extends HTMLElement {
    private inputElement!: HTMLInputElement;
    private previewContainer!: HTMLDivElement;
    private statusElement!: HTMLDivElement;
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.initElements();
      this.setupEventListeners();
    }
  
    private render() {
      this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: block;
            margin: 20px 0;
          }
          .upload-container {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
          }
          .preview-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }
          .preview-item {
            position: relative;
            width: 100px;
            height: 100px;
          }
          .preview-item img, .preview-item video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
          }
          .status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
          }
          button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          }
          button:hover {
            background: #45a049;
          }
        </style>
        <div class="upload-container">
          <h3>Sube tus memes</h3>
          <input type="file" accept="image/*,video/*" multiple>
          <div class="preview-container"></div>
          <div class="status"></div>
          <button type="button">Subir memes</button>
        </div>
      `;
    }
  
    private initElements() {
      this.inputElement = this.shadowRoot!.querySelector('input')!;
      this.previewContainer = this.shadowRoot!.querySelector('.preview-container')!;
      this.statusElement = this.shadowRoot!.querySelector('.status')!;
    }
  
    private setupEventListeners() {
      this.inputElement.addEventListener('change', this.handleFileSelection.bind(this));
      this.shadowRoot!.querySelector('button')!.addEventListener('click', this.handleUpload.bind(this));
    }
  
    private handleFileSelection(event: Event) {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
  
      this.previewContainer.innerHTML = '';
      
      Array.from(files).forEach(file => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          previewItem.appendChild(img);
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.muted = true;
          video.autoplay = true;
          video.loop = true;
          previewItem.appendChild(video);
        }
        
        this.previewContainer.appendChild(previewItem);
      });
    }
  
    private async handleUpload() {
      const files = this.inputElement.files;
      if (!files || files.length === 0) {
        this.statusElement.textContent = 'No hay archivos seleccionados';
        return;
      }
  
      this.statusElement.textContent = 'Subiendo...';
      
      try {
        const uploadPromises = Array.from(files).map(file => uploadMeme(file));
        const results = await Promise.all(uploadPromises);
        
        const successfulUploads = results.filter((r: UploadResult) => r.success).length;
        this.statusElement.textContent = `Subidos ${successfulUploads} de ${files.length} memes`;
        
        // Dispara evento personalizado para notificar a la galería
        this.dispatchEvent(new CustomEvent('memes-uploaded', {
          bubbles: true,
          composed: true
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        this.statusElement.textContent = `Error al subir: ${errorMessage}`;
      }
    }
  }
  
  customElements.define('meme-uploader', MemeUploader);