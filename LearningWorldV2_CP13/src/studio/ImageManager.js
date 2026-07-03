import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * ImageManager - Placeholder for image management panel.
 */
export class ImageManager {
  #container = null;

  constructor(container, context) {
    this.#container = container;
    this.#context = context;
  }

  mount() {
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel'] });
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '🖼 Quản lý hình ảnh' });
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