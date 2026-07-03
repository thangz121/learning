import { App } from './App.js';

/**
 * Bootstrap - Khởi động ứng dụng.
 */
function bootstrap() {
  const root = document.querySelector('#app');
  if (!root) {
    console.error('Không tìm thấy #app');
    return;
  }
  const app = new App(root);
  app.start('splash');
}

document.addEventListener('DOMContentLoaded', bootstrap);
