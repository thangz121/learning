import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * CourseSelectScene - Chọn môn học.
 */
export class CourseSelectScene extends Scene {
  async enter() {
    this.element.classList.add('scene--course-select');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Chọn môn học' });
    stage.appendChild(title);

    const courses = await this.context.lessonRepository.getCourses();
    for (const courseId of courses) {
      const manifest = await this.context.lessonRepository.getManifest(courseId);
      const displayName = manifest?.name || courseId;
      const btn = new Button(displayName, {
        onClick: () => this.context.sceneManager.go('lesson-select', { course: courseId }),
      });
      stage.appendChild(btn.mount());
      this.components.push(btn);
    }

    const btnBack = new Button('Quay lại', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('main-menu'),
    });
    stage.appendChild(btnBack.mount());
    this.components.push(btnBack);

    this.element.appendChild(stage);
  }
}
