import { DOMHelper } from '../helpers/DOMHelper.js';
import { GameConfig } from '../constants/GameConfig.js';

/**
 * RuntimeErrorHandler - Centralized error handling for production.
 *
 * CONTRACT:
 *   - Never throws in production.
 *   - Displays user-friendly error screen via DOMHelper.
 *   - Logs to console only when GameConfig.debug is true.
 *   - Reload uses window.location.reload() as fallback.
 *     Future: replace with NavigationController.goTo() or App.restart() when available.
 */
export class RuntimeErrorHandler {
  static handle(error, context = {}) {
    const phase = context.phase || 'runtime';
    const message = error?.message || 'Unknown error';

    if (GameConfig.debug) {
      // eslint-disable-next-line no-console
      console.error(`[${phase}]`, message);
    }

    if (typeof document !== 'undefined') {
      const app = document.querySelector('#app');
      if (app) {
        app.innerHTML = '';
        const errorScreen = DOMHelper.create('div', { classes: ['error-screen'] });
        const content = DOMHelper.create('div', { classes: ['error-screen__content'] });
        const heading = DOMHelper.create('h1', { text: '😕 Oops!' });
        const desc = DOMHelper.create('p', { text: 'Đã có lỗi xảy ra. Vui lòng tải lại trang.' });
        const detail = DOMHelper.create('p', { classes: ['error-screen__detail'], text: message });
        const reloadBtn = DOMHelper.create('button', { text: 'Tải lại' });
        reloadBtn.addEventListener('click', () => {
          if (typeof window !== 'undefined' && window.location && typeof window.location.reload === 'function') {
            window.location.reload();
          }
        });
        content.appendChild(heading);
        content.appendChild(desc);
        content.appendChild(detail);
        content.appendChild(reloadBtn);
        errorScreen.appendChild(content);
        app.appendChild(errorScreen);
      }
    }
  }
}