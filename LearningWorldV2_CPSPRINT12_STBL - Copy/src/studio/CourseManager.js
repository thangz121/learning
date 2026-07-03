import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * CourseManager - CRUD operations for courses.
 */
export class CourseManager {
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
    const title = DOMHelper.create('h2', { classes: ['studio-panel-title'], text: '📚 Quản lý khóa học' });
    wrapper.appendChild(title);

    const btnAdd = new Button('Thêm khóa học', {
      onClick: () => this.#showAddForm(),
    });
    wrapper.appendChild(btnAdd.mount());
    this.#components.push(btnAdd);

    this.#renderCourseList(wrapper);

    this.#container.appendChild(wrapper);
  }

  #renderCourseList(parent) {
    const list = DOMHelper.create('div', { classes: ['studio-list'] });
    const placeholder = DOMHelper.create('div', {
      classes: ['studio-placeholder'],
      text: 'Chưa có khóa học nào.',
    });
    list.appendChild(placeholder);
    parent.appendChild(list);
  }

  #showAddForm() {
    // TODO: Implement course creation via FileSystemProvider
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