import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Button - Reusable button component.
 */
export class Button {
  constructor(text, options = {}) {
    this.element = DOMHelper.create('button', {
      classes: ['button', ...(options.variant ? [`button--${options.variant}`] : [])],
      text,
      attrs: { type: 'button' }
    });
    if (options.onClick) this.element.addEventListener('click', options.onClick);
  }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
  disable() { this.element.disabled = true; }
  enable() { this.element.disabled = false; }
}
