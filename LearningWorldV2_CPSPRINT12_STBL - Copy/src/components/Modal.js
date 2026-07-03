import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Modal - Overlay modal.
 */
export class Modal {
  constructor() {
    this.element = DOMHelper.create('div', { classes: ['modal'] });
    this.overlay = DOMHelper.create('div', { classes: ['modal-overlay'] });
    this.content = DOMHelper.create('div', { classes: ['modal-content'] });
    this.element.appendChild(this.overlay);
    this.element.appendChild(this.content);
  }

  setContent(child) {
    DOMHelper.clear(this.content);
    this.content.appendChild(child);
  }

  open() { this.element.style.display = 'flex'; }
  close() { this.element.style.display = 'none'; }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
}
