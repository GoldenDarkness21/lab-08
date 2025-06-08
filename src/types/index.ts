export interface Meme {
  name: string;
  url: string;
}

export interface UploadResult {
  success: boolean;
  error?: string;
  path?: string;
}

declare global {
  interface HTMLElementEventMap {
    'meme-selected': CustomEvent<Meme>;
    'memes-uploaded': CustomEvent<void>;
  }
} 