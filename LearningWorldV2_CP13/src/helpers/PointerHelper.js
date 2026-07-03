/**
 * PointerHelper - Unified pointer abstraction.
 */
export class PointerHelper {
  #el;
  #onStart = null;
  #onMove = null;
  #onEnd = null;
  #attached = false;
  #pointerId = null;
  #captured = false;

  constructor(el) {
    if (!el || !(el instanceof HTMLElement)) throw new Error('PointerHelper requires HTMLElement');
    this.#el = el;
  }

  onStart(cb) { this.#onStart = cb; }
  onMove(cb) { this.#onMove = cb; }
  onEnd(cb) { this.#onEnd = cb; }

  attach() {
    if (this.#attached) return;
    this.#el.addEventListener('pointerdown', this.#handleDown);
    this.#el.style.touchAction = 'none';
    this.#attached = true;
  }

  detach() {
    if (!this.#attached) return;
    this.#releaseCapture();
    this.#el.removeEventListener('pointerdown', this.#handleDown);
    this.#el.style.touchAction = '';
    this.#attached = false;
    this.#pointerId = null;
    this.#captured = false;
  }

  #handleDown = (e) => {
    if (e.button !== 0 && e.button !== -1) return;
    if (this.#pointerId !== null) return;
    e.preventDefault();
    this.#pointerId = e.pointerId;
    try { this.#el.setPointerCapture(e.pointerId); this.#captured = true; } catch { this.#captured = false; }
    this.#onStart?.(this.#pos(e), e);
    this.#el.addEventListener('pointermove', this.#handleMove);
    this.#el.addEventListener('pointerup', this.#handleUp);
    this.#el.addEventListener('pointercancel', this.#handleUp);
  };

  #handleMove = (e) => {
    if (e.pointerId !== this.#pointerId) return;
    e.preventDefault();
    this.#onMove?.(this.#pos(e), e);
  };

  #handleUp = (e) => {
    if (e.pointerId !== this.#pointerId) return;
    e.preventDefault();
    this.#onEnd?.(this.#pos(e), e);
    this.#cleanup(e.pointerId);
  };

  #cleanup(pid) {
    this.#el.removeEventListener('pointermove', this.#handleMove);
    this.#el.removeEventListener('pointerup', this.#handleUp);
    this.#el.removeEventListener('pointercancel', this.#handleUp);
    if (this.#captured) { try { this.#el.releasePointerCapture(pid); } catch {} this.#captured = false; }
    this.#pointerId = null;
  }

  #releaseCapture() {
    if (this.#pointerId !== null && this.#captured) {
      try { this.#el.releasePointerCapture(this.#pointerId); } catch {}
      this.#captured = false;
    }
    this.#el.removeEventListener('pointermove', this.#handleMove);
    this.#el.removeEventListener('pointerup', this.#handleUp);
    this.#el.removeEventListener('pointercancel', this.#handleUp);
  }

  #pos(e) { return { x: e.clientX, y: e.clientY }; }
}
