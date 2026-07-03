import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { GameConfig } from '../constants/GameConfig.js';

/**
 * SplashScene - Logo splash with auto navigation to main menu.
 */
export class SplashScene extends Scene {
  #timer = null;

  async enter() {
    await super.enter();
    this.element.classList.add('scene--splash');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });
    const logo = DOMHelper.create('div', { classes: ['splash-logo'], text: GameConfig.appName });
    stage.appendChild(logo);
    this.element.appendChild(stage);

    this.#timer = setTimeout(() => {
      if (!this.isDestroyed() && this.context && this.context.navigationController) {
        this.context.navigationController.goTo('main-menu');
      }
    }, GameConfig.splashDurationMs);
  }

  async beforeExit() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  destroy() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    super.destroy();
  }
}