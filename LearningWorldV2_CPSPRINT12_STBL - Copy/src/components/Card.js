import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Card - Reusable card component.
 */
export class Card {
  constructor(options = {}) {
    this.element = DOMHelper.create('div', {
      classes: ['card', ...(options.classes || [])]
    });
    if (options.title) {
      this.element.appendChild(DOMHelper.create('h3', { classes: ['card-title'], text: options.title }));
    }
    if (options.content) {
      this.element.appendChild(DOMHelper.create('div', { classes: ['card-content'], text: options.content }));
    }
  }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
}
