import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';
import { GameConfig } from '../constants/GameConfig.js';

/**
 * MainMenuScene - Main menu with navigation to gameplay, studio, and settings.
 */
export class MainMenuScene extends Scene {
  async enter() {
    await super.enter();
    this.element.classList.add('scene--main-menu');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const title = DOMHelper.create('h1', { classes: ['title'], text: GameConfig.appName });
    stage.appendChild(title);

    const btnLearn = new Button('Học tập', {
      onClick: () => this.context.navigationController.goTo('course-select'),
    });
    stage.appendChild(btnLearn.mount());
    this.addComponent(btnLearn);

    const btnStudio = new Button('Learning Studio', {
      onClick: () => this.context.navigationController.goTo('studio'),
    });
    stage.appendChild(btnStudio.mount());
    this.addComponent(btnStudio);

    const btnSettings = new Button('Cài đặt', {
      variant: 'secondary',
      onClick: () => this.context.navigationController.goTo('settings'),
    });
    stage.appendChild(btnSettings.mount());
    this.addComponent(btnSettings);

    this.element.appendChild(stage);
  }
}