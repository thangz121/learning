import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Loading - Loading spinner.
 */
export class Loading {
  constructor() {
    this.element = DOMHelper.create('div', { classes: ['loading'] });
    this.element.appendChild(DOMHelper.create('div', { classes: ['loading-spinner'] }));
    this.element.appendChild(DOMHelper.create('span', { classes: ['loading-text'], text: 'Đang tải...' }));
  }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
}
