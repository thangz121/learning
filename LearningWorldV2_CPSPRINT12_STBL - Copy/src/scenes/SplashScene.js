import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { TimeHelper } from '../helpers/TimeHelper.js';

/**
 * SplashScene - Màn hình khởi động.
 */
export class SplashScene extends Scene {
  async enter() {
    this.element.classList.add('scene--splash');
    const art = DOMHelper.create('div', { classes: ['splash-art'], text: '🐼' });
    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Learning World' });
    const subtitle = DOMHelper.create('p', { classes: ['subtitle'], text: 'Học mà chơi, chơi mà học!' });
    this.element.appendChild(art);
    this.element.appendChild(title);
    this.element.appendChild(subtitle);
    await TimeHelper.delay(1500);
    this.context.sceneManager.go('main-menu');
  }
}
