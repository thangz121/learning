import { DOMHelper } from '../helpers/DOMHelper.js';
import { StudioRouter } from './StudioRouter.js';

/**
 * Studio - Coordinator for Learning Studio.
 * Manages studio state and routes between panels.
 */
export class Studio {
  #container = null;
  #router = null;
  #currentPanel = null;
  #abortController = null;

  constructor(container, context) {
    this.#container = container;
    this.context = context;
  }

  mount() {
    this.#container.innerHTML = '';
    const shell = DOMHelper.create('div', { classes: ['studio-shell'] });
    const sidebar = DOMHelper.create('div', { classes: ['studio-sidebar'] });
    const main = DOMHelper.create('div', { classes: ['studio-main'] });

    const navItems = [
      { id: 'courses', text: '📚 Khóa học' },
      { id: 'lessons', text: '📖 Bài học' },
      { id: 'questions', text: '❓ Câu hỏi' },
      { id: 'assets', text: '📦 Tài nguyên' },
      { id: 'audio', text: '🎙 Audio' },
      { id: 'images', text: '🖼 Hình ảnh' },
      { id: 'import', text: '📥 Nhập liệu' },
      { id: 'preview', text: '👀 Xem trước' },
      { id: 'debug', text: '🐞 Debug' },
      { id: 'settings', text: '⚙ Cài đặt' },
    ];

    this.#abortController = new AbortController();
    for (const item of navItems) {
      const btn = DOMHelper.create('button', {
        classes: ['studio-nav-item'],
        text: item.text,
        attrs: { 'data-panel': item.id },
      });
      btn.addEventListener('click', () => this.#showPanel(item.id), {
        signal: this.#abortController.signal,
      });
      sidebar.appendChild(btn);
    }

    shell.appendChild(sidebar);
    shell.appendChild(main);
    this.#container.appendChild(shell);

    this.#router = new StudioRouter(main, this.context);
    this.#showPanel('courses');
  }

  #showPanel(panelId) {
    if (this.#currentPanel) {
      this.#currentPanel.destroy();
      this.#currentPanel = null;
    }
    this.#currentPanel = this.#router.createPanel(panelId);
    if (this.#currentPanel) {
      this.#currentPanel.mount();
    }
  }

  destroy() {
    if (this.#abortController) {
      this.#abortController.abort();
      this.#abortController = null;
    }
    if (this.#currentPanel) {
      this.#currentPanel.destroy();
      this.#currentPanel = null;
    }
    this.#container.innerHTML = '';
    this.#container = null;
  }
}