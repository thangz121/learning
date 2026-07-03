import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { GameplayController } from '../controllers/GameplayController.js';
import { Button } from '../components/Button.js';

/**
 * GameplayScene - Orchestrates gameplay via GameplayController.
 */
export class GameplayScene extends Scene {
  #controller = null;
  #controllerDestroyed = false;

  async enter(data) {
    await super.enter(data);
    this.element.classList.add('scene--gameplay');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const container = DOMHelper.create('div', { classes: ['gameplay-container'] });
    stage.appendChild(container);

    const btnBack = new Button('Thoát', {
      variant: 'secondary',
      onClick: () => this.context.navigationController.goTo('lesson-select', {
        course: data?.course,
        category: data?.category,
      }),
    });
    stage.appendChild(btnBack.mount());
    this.addComponent(btnBack);

    this.element.appendChild(stage);

    this.#controller = new GameplayController(this.context);
    this.#controllerDestroyed = false;
    await this.#controller.startLesson({
      course: data?.course,
      category: data?.category,
      lessonId: data?.lessonId,
      container,
      onComplete: (result) => {
        if (!this.isDestroyed() && this.context && this.context.navigationController) {
          this.context.navigationController.goTo('result', {
            result,
            course: data?.course,
            category: data?.category,
            lessonId: data?.lessonId,
          });
        }
      },
    });
  }

  async beforeExit() {
    this.#destroyController();
  }

  destroy() {
    this.#destroyController();
    super.destroy();
  }

  #destroyController() {
    if (this.#controller && !this.#controllerDestroyed) {
      this.#controllerDestroyed = true;
      this.#controller.destroy();
      this.#controller = null;
    }
  }
}