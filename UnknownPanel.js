import { DOMHelper } from '../helpers/DOMHelper.js';
import { Logger } from '../core/Logger.js';

/**
 * UnknownPanel - Displayed when panel ID is not registered.
 * Shows panel ID, available panels, and debug info.
 */
export class UnknownPanel {
  #container = null;
  #panelId = '';
  #availablePanels = [];

  constructor(container, context, panelId, availablePanels) {
    this.#container = container;
    this.#panelId = panelId;
    this.#availablePanels = availablePanels || [];
  }

  mount() {
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel', 'studio-panel--unknown'] });

    const title = DOMHelper.create('h2', {
      classes: ['studio-panel-title'],
      text: '❓ Panel không xác định',
    });
    wrapper.appendChild(title);

    const info = DOMHelper.create('div', { classes: ['studio-unknown-info'] });
    info.appendChild(DOMHelper.create('p', { text: `Panel ID: "${this.#panelId}"` }));
    info.appendChild(DOMHelper.create('p', { text: 'Panel này chưa được đăng ký trong StudioRouter.' }));
    wrapper.appendChild(info);

    if (this.#availablePanels.length > 0) {
      const listTitle = DOMHelper.create('h3', { text: 'Các panel có sẵn:' });
      wrapper.appendChild(listTitle);

      const list = DOMHelper.create('ul', { classes: ['studio-unknown-list'] });
      for (const panel of this.#availablePanels) {
        list.appendChild(DOMHelper.create('li', { text: panel }));
      }
      wrapper.appendChild(list);
    }

    const actions = DOMHelper.create('div', { classes: ['studio-unknown-actions'] });

    const btnCopy = DOMHelper.create('button', { text: '📋 Copy Error' });
    btnCopy.addEventListener('click', () => this.#copyError());
    actions.appendChild(btnCopy);

    const btnLog = DOMHelper.create('button', { text: '📜 Open Log' });
    btnLog.addEventListener('click', () => this.#openLog());
    actions.appendChild(btnLog);

    wrapper.appendChild(actions);
    this.#container.appendChild(wrapper);
  }

  async #copyError() {
    const text = `Unknown Panel: "${this.#panelId}"\nAvailable: ${this.#availablePanels.join(', ')}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Clipboard permission denied, silently fail
    }
  }

  #openLog() {
    Logger.for('Studio').warn('UnknownPanel opened', { panelId: this.#panelId, available: this.#availablePanels });
  }

  destroy() {
    this.#container.innerHTML = '';
  }
}