import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Toast - Notification toast.
 */
export class Toast {
  constructor(container) {
    this.container = container;
    this.element = DOMHelper.create('div', { classes: ['toast'] });
  }

  show(message, duration = 2400) {
    this.element.textContent = message;
    this.container.appendChild(this.element);
    setTimeout(() => { if (this.element.parentNode) this.element.parentNode.removeChild(this.element); }, duration);
  }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
}
