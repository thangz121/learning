import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';

/**
 * CourseSelectScene - Chọn môn học.
 */
export class CourseSelectScene extends Scene {
  async enter() {
    await super.enter();
    this.element.classList.add('scene--course-select');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });

    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Chọn môn học' });
    stage.appendChild(title);

    const courses = await this.context.lessonRepository.getCourses();
    const manifests = await Promise.all(
      courses.map((id) => this.context.lessonRepository.getManifest(id))
    );

    for (let i = 0; i < courses.length; i++) {
      const courseId = courses[i];
      const manifest = manifests[i];
      const displayName = manifest?.name || courseId;
      const btn = new Button(displayName, {
        onClick: () => this.context.navigationController.goTo('lesson-select', { course: courseId }),
      });
      stage.appendChild(btn.mount());
      this.addComponent(btn);
    }

    const btnBack = new Button('Quay lại', {
      variant: 'secondary',
      onClick: () => this.context.navigationController.goTo('main-menu'),
    });
    stage.appendChild(btnBack.mount());
    this.addComponent(btnBack);

    this.element.appendChild(stage);
  }
}