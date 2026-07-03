import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { GameplayController } from '../controllers/GameplayController.js';
import { Button } from '../components/Button.js';

/**
 * GameplayScene - Màn hình gameplay.
 */
export class GameplayScene extends Scene {
  #controller = null;

  async enter(data) {
    this.element.classList.add('scene--gameplay');
    const container = DOMHelper.create('div', { classes: ['gameplay-container'] });
    this.element.appendChild(container);

    // Navigation HUD
    const nav = DOMHelper.create('div', { classes: ['gameplay-nav'] });
    const btnBack = new Button('← Bài học', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('lesson-select', { course: data?.course }),
    });
    const btnHome = new Button('🏠 Trang chủ', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('main-menu'),
    });
    nav.appendChild(btnBack.mount());
    nav.appendChild(btnHome.mount());
    this.element.appendChild(nav);
    this.components.push(btnBack, btnHome);

    this.#controller = new GameplayController(this.context);
    await this.#controller.startLesson({
      course: data?.course,
      category: data?.category,
      lessonId: data?.lessonId,
      container,
      onComplete: (result) => {
        this.context.sceneManager.go('result', {
          result,
          course: data?.course,
          category: data?.category,
          lessonId: data?.lessonId,
        });
      },
    });
  }

  async exit() {
    if (this.#controller) {
      this.#controller.destroy();
      this.#controller = null;
    }
  }
}
