import { DOMHelper } from '../../helpers/DOMHelper.js';
import { RendererFactory } from '../../renderers/RendererFactory.js';

/**
 * PreviewPanel - Standalone lesson preview using production renderers.
 * No scoring, no progress saving.
 */
export class PreviewPanel {
  #container = null;
  #context = null;
  #renderer = null;

  constructor(container, context) {
    this.#container = container;
    this.#context = context;
  }

  mount() {
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel'] });
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '👀 Xem trước' });
    wrapper.appendChild(title);

    const placeholder = DOMHelper.create('div', {
      classes: ['studio-placeholder'],
      text: 'Chọn bài học để xem trước.',
    });
    wrapper.appendChild(placeholder);

    this.#container.appendChild(wrapper);
  }

  /**
   * Preview a specific question using production renderer.
   * @param {object} question - Question data
   */
  previewQuestion(question) {
    if (this.#renderer) {
      this.#renderer.destroy();
      this.#renderer = null;
    }
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel'] });
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '👀 Xem trước' });
    wrapper.appendChild(title);

    const previewContainer = DOMHelper.create('div', { classes: ['studio-preview-container'] });
    wrapper.appendChild(previewContainer);
    this.#container.appendChild(wrapper);

    this.#renderer = RendererFactory.create(question.renderer || 'select');
    this.#renderer.setAudioEngine(this.#context.audioEngine || null);
    this.#renderer.mount(previewContainer);
    this.#renderer.setProgress(0, 1);
    this.#renderer.render(question);
  }

  destroy() {
    if (this.#renderer) {
      this.#renderer.destroy();
      this.#renderer = null;
    }
    this.#container.innerHTML = '';
  }
}