import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * ResultScene - Màn hình kết quả.
 */
export class ResultScene extends Scene {
  async enter(data) {
    this.element.classList.add('scene--result');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });
    const result = data?.result || {};

    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Kết quả' });
    stage.appendChild(title);

    stage.appendChild(DOMHelper.create('p', { text: `Đúng: ${result.correct || 0}` }));
    stage.appendChild(DOMHelper.create('p', { text: `Sai: ${result.wrong || 0}` }));
    stage.appendChild(DOMHelper.create('p', { text: `Điểm: ${result.score || 0}%` }));
    stage.appendChild(DOMHelper.create('p', { text: `Sao: ${'⭐'.repeat(result.stars || 0)}` }));

    const btnRetry = new Button('Làm lại', {
      onClick: () => this.context.sceneManager.go('gameplay', {
        course: data?.course,
        category: data?.category,
        lessonId: data?.lessonId,
      }),
    });
    stage.appendChild(btnRetry.mount());
    this.components.push(btnRetry);

    const btnNext = new Button('Bài tiếp theo', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('lesson-select', { course: data?.course }),
    });
    stage.appendChild(btnNext.mount());
    this.components.push(btnNext);

    const btnLessonSelect = new Button('Chọn bài học', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('lesson-select', { course: data?.course }),
    });
    stage.appendChild(btnLessonSelect.mount());
    this.components.push(btnLessonSelect);

    const btnCourseSelect = new Button('Chọn môn học', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('course-select'),
    });
    stage.appendChild(btnCourseSelect.mount());
    this.components.push(btnCourseSelect);

    const btnMenu = new Button('Về Menu', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('main-menu'),
    });
    stage.appendChild(btnMenu.mount());
    this.components.push(btnMenu);

    this.element.appendChild(stage);
  }
}
