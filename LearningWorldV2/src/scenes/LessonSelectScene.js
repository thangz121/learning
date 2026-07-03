import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * LessonSelectScene - Select a lesson within a category.
 */
export class LessonSelectScene extends Scene {
  async enter(data) {
    await super.enter(data);
    this.element.classList.add('scene--lesson-select');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Chọn bài học' });
    stage.appendChild(title);

    const course = data?.course;
    const category = data?.category;

    if (!course || !category) {
      const btnBack = new Button('Quay lại', {
        variant: 'secondary',
        onClick: () => this.context.navigationController.goTo('course-select'),
      });
      stage.appendChild(btnBack.mount());
      this.addComponent(btnBack);
      this.element.appendChild(stage);
      return;
    }

    const lessons = await this.context.lessonRepository.getLessons(course, category);
    for (const lesson of lessons) {
      const btn = new Button(lesson.title || lesson.id, {
        onClick: () => this.context.navigationController.goTo('gameplay', {
          course,
          category,
          lessonId: lesson.id,
        }),
      });
      stage.appendChild(btn.mount());
      this.addComponent(btn);
    }

    const btnBack = new Button('Quay lại', {
      variant: 'secondary',
      onClick: () => this.context.navigationController.goTo('course-select'),
    });
    stage.appendChild(btnBack.mount());
    this.addComponent(btnBack);

    this.element.appendChild(stage);
  }
}