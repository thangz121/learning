import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * LessonManager - CRUD operations for lessons.
 */
export class LessonManager {
  #container = null;
  #context = null;
  #components = [];

  constructor(container, context) {
    this.#container = container;
    this.#context = context;
  }

  mount() {
    this.#container.innerHTML = '';
    const wrapper = DOMHelper.create('div', { classes: ['studio-panel'] });
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '📖 Quản lý bài học' });
    wrapper.appendChild(title);

    const btnAdd = new Button('Thêm bài học', {
      onClick: () => this.#showAddForm(),
    });
    wrapper.appendChild(btnAdd.mount());
    this.#components.push(btnAdd);

    const placeholder = DOMHelper.create('div', {
      classes: ['studio-placeholder'],
      text: 'Chọn khóa học để xem bài học.',
    });
    wrapper.appendChild(placeholder);

    this.#container.appendChild(wrapper);
  }

  #showAddForm() {
    // TODO: Implement lesson creation via FileSystemProvider
    return;
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