import './components/meme-uploader/meme-uploader';
import './components/meme-gallery/meme-gallery';
import './components/meme-viewer/meme-viewer';

// Importar estilos
import './styles/main.css';

class MemeWallApp extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  private render() {
    document.body.innerHTML = `
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: 'Comic Neue', cursive;
        }
        header {
          text-align: center;
          margin-bottom: 30px;
        }
        h1 {
          color: var(--primary-color);
          margin: 0;
        }
        footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          color: #666;
        }
      </style>
      <header>
        <h1>MemeWall</h1>
        <p>Comparte y organiza tus memes en la nube</p>
      </header>
      <main>
        <meme-uploader></meme-uploader>
        <meme-gallery></meme-gallery>
        <meme-viewer></meme-viewer>
      </main>
      <footer>
        <p>© ${new Date().getFullYear()} MemeWall - Todos los memes reservados</p>
      </footer>
    `;
  }
}

// Registrar el componente principal
customElements.define('meme-wall', MemeWallApp);

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(document.createElement('meme-wall'));
});