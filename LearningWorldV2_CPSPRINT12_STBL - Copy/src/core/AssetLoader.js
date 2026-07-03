/**
 * AssetLoader - Preloads and caches assets.
 */
export class AssetLoader {
  constructor() { this.cache = new Map(); }

  async loadImage(src) {
    if (this.cache.has(src)) return this.cache.get(src);
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => { this.cache.set(src, img); res(img); };
      img.onerror = rej;
      img.src = src;
    });
  }

  async loadAudio(src) {
    if (this.cache.has(src)) return this.cache.get(src);
    const a = new Audio(src); a.preload = 'auto';
    this.cache.set(src, a); return a;
  }

  async loadJSON(src) {
    if (this.cache.has(src)) return this.cache.get(src);
    const r = await fetch(src); const d = await r.json();
    this.cache.set(src, d); return d;
  }

  clear() { this.cache.clear(); }
}
