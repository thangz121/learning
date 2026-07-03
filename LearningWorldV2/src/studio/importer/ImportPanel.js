import { DOMHelper } from '../../helpers/DOMHelper.js';
import { Button } from '../../components/Button.js';
import { ImportPipeline } from './ImportPipeline.js';

/**
 * ImportPanel - UI for content import.
 */
export class ImportPanel {
  #container = null;
  #context = null;
  #components = [];
  #textarea = null;
  #btnImport = null;
  #btnSimulate = null;
  #pipeline = null;

  constructor(container, context) {
    this.#container = container;
    this.#context = context;
    this.#pipeline = new ImportPipeline();
  }

  mount() {
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel'] });
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '📥 Nhập nội dung' });
    wrapper.appendChild(title);

    this.#textarea = DOMHelper.create('textarea', {
      classes: ['studio-import-input'],
      attrs: { placeholder: 'Dán JS hoặc JSON vào đây...', rows: '10' },
    });
    wrapper.appendChild(this.#textarea);

    this.#btnImport = new Button('Nhập', {
      onClick: () => this.#handleImport(),
    });
    wrapper.appendChild(this.#btnImport.mount());
    this.#components.push(this.#btnImport);

    this.#btnSimulate = new Button('Thử nghiệm (Dry Run)', {
      variant: 'secondary',
      onClick: () => this.#handleSimulate(),
    });
    wrapper.appendChild(this.#btnSimulate.mount());
    this.#components.push(this.#btnSimulate);

    this.#container.appendChild(wrapper);
  }

  async #handleImport() {
    const raw = this.#textarea?.value || '';
    if (!raw.trim()) {
      // TODO: Show validation error via Toast/Modal
      return;
    }
    this.#setLoading(true);
    const result = await this.#pipeline.run(raw);
    this.#setLoading(false);
    // TODO: Show result via ImportReport
    void result;
  }

  async #handleSimulate() {
    const raw = this.#textarea?.value || '';
    if (!raw.trim()) {
      // TODO: Show validation error via Toast/Modal
      return;
    }
    this.#setLoading(true);
    const result = await this.#pipeline.simulate(raw);
    this.#setLoading(false);
    // TODO: Show result via ImportReport
    void result;
  }

  #setLoading(loading) {
    if (this.#btnImport) this.#btnImport.element.disabled = loading;
    if (this.#btnSimulate) this.#btnSimulate.element.disabled = loading;
    if (this.#textarea) this.#textarea.disabled = loading;
  }

  destroy() {
    for (const c of this.#components) {
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
    }
    this.#components = [];
    this.#container.innerHTML = '';
  }
}