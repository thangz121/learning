import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';
import { Studio } from '../studio/Studio.js';
import { ScrollSystem } from '../core/ScrollSystem.js';

/**
 * StudioScene - Learning Studio entry point.
 */
export class StudioScene extends Scene {
  #studio = null;

  async enter() {
    await super.enter();
    this.element.classList.add('scene--studio');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const header = DOMHelper.create('div', { classes: ['studio-header'] });
    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Learning Studio' });
    header.appendChild(title);

    const btnBack = new Button('Quay lại Menu', {
      variant: 'secondary',
      onClick: () => this.context.navigationController.goTo('main-menu'),
    });
    header.appendChild(btnBack.mount());
    this.addComponent(btnBack);

    const studioContainer = DOMHelper.create('div', { classes: ['studio-container'] });
    ScrollSystem.enable(studioContainer);

    stage.appendChild(header);
    stage.appendChild(studioContainer);
    this.element.appendChild(stage);

    this.#studio = new Studio(studioContainer, this.context);
    this.#studio.mount();
  }

  async beforeExit() {
    if (this.#studio) {
      this.#studio.destroy();
      this.#studio = null;
    }
  }

  destroy() {
    if (this.#studio) {
      this.#studio.destroy();
      this.#studio = null;
    }
    super.destroy();
  }
}