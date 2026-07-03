import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * ResultScene - Display session result with stars, score, and navigation.
 */
export class ResultScene extends Scene {
  async enter(data) {
    await super.enter(data);
    this.element.classList.add('scene--result');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const result = data?.result || {};
    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Kết quả' });
    stage.appendChild(title);

    const stars = '⭐'.repeat(result.stars || 0) + '☆'.repeat(Math.max(0, 3 - (result.stars || 0)));
    const scoreText = `Điểm: ${result.score || 0}%`;
    const durationText = `Thời gian: ${Math.round((result.duration || 0) / 1000)} giây`;

    stage.appendChild(DOMHelper.create('div', { classes: ['result-stars'], text: stars }));
    stage.appendChild(DOMHelper.create('div', { classes: ['result-score'], text: scoreText }));
    stage.appendChild(DOMHelper.create('div', { classes: ['result-duration'], text: durationText }));

    const btnReplay = new Button('Chơi lại', {
      onClick: () => this.context.navigationController.goTo('gameplay', {
        course: data?.course,
        category: data?.category,
        lessonId: data?.lessonId,
      }),
    });
    stage.appendChild(btnReplay.mount());
    this.addComponent(btnReplay);

    const btnMenu = new Button('Menu chính', {
      variant: 'secondary',
      onClick: () => this.context.navigationController.goTo('main-menu'),
    });
    stage.appendChild(btnMenu.mount());
    this.addComponent(btnMenu);

    this.element.appendChild(stage);
  }
}