import { DOMHelper } from '../../helpers/DOMHelper.js';

/**
 * DebugPanel - Placeholder for debug tools panel.
 */
export class DebugPanel {
  #container = null;

  constructor(container, context) {
    this.#container = container;
    this.#context = context;
  }

  mount() {
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel'] });
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '🐞 Debug' });
    wrapper.appendChild(title);

    const placeholder = DOMHelper.create('div', {
      classes: ['studio-placeholder'],
      text: 'Tính năng đang phát triển.',
    });
    wrapper.appendChild(placeholder);

    this.#container.appendChild(wrapper);
  }

  destroy() {
    this.#container.innerHTML = '';
  }
}