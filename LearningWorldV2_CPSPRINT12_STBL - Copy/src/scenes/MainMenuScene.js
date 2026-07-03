import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * MainMenuScene - Màn hình chính.
 */
export class MainMenuScene extends Scene {
  async enter() {
    this.element.classList.add('scene--main-menu');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const brand = DOMHelper.create('div', { classes: ['brand-mark'], text: '🐼 Learning World' });
    stage.appendChild(brand);

    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Chào mừng bé!' });
    stage.appendChild(title);

    const btnCourses = new Button('Khóa học', {
      onClick: () => this.context.sceneManager.go('course-select'),
    });
    stage.appendChild(btnCourses.mount());
    this.components.push(btnCourses);

    const btnSettings = new Button('Cài đặt', {
      variant: 'secondary',
      onClick: () => { /* Future: settings modal */ },
    });
    stage.appendChild(btnSettings.mount());
    this.components.push(btnSettings);

    this.element.appendChild(stage);
  }
}
