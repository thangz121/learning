import { App } from './App.js';
import { RuntimeErrorHandler } from '../core/RuntimeErrorHandler.js';

/**
 * Bootstrap - Khởi động ứng dụng.
 */
function bootstrap() {
  const root = document.querySelector('#app');
  if (!root) {
    RuntimeErrorHandler.handle(new Error('Không tìm thấy #app'), { phase: 'bootstrap' });
    return;
  }
  const app = new App(root);
  app.start('splash');
}

document.addEventListener('DOMContentLoaded', bootstrap);