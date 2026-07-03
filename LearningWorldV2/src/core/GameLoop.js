/**
 * GameLoop - RAF-based update loop.
 */
export class GameLoop {
  constructor() {
    this.running = false;
    this.callbacks = new Set();
    this.rafId = null;
  }

  onTick(cb) { this.callbacks.add(cb); return () => this.callbacks.delete(cb); }
  start() { if (this.running) return; this.running = true; this.#tick(); }
  stop() { this.running = false; if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; } }

  #tick = () => {
    if (!this.running) return;
    this.callbacks.forEach((cb) => cb());
    this.rafId = requestAnimationFrame(this.#tick);
  };
}
