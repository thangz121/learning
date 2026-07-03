import { Scene } from './Scene.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { Button } from '../components/Button.js';
import { Card } from '../components/Card.js';

/**
 * LessonSelectScene - Chọn bài học.
 */
export class LessonSelectScene extends Scene {
  async enter(data) {
    this.element.classList.add('scene--lesson-select');
    const stage = DOMHelper.create('div', { classes: ['scene__stage'] });
    const course = data?.course || 'vietnamese';

    const title = DOMHelper.create('h1', { classes: ['title'], text: 'Chọn bài học' });
    stage.appendChild(title);

    const categories = await this.context.lessonRepository.getCategories(course);
    for (const cat of categories) {
      const lessons = await this.context.lessonRepository.getLessons(course, cat.id);
      for (const lesson of lessons) {
        const card = new Card({
          title: lesson.title,
          content: `Độ khó: ${lesson.difficulty} | Thời lượng: ${lesson.duration} phút`
        });
        card.element.style.cursor = 'pointer';
        card.element.addEventListener('click', () => {
          this.context.sceneManager.go('gameplay', { course, category: cat.id, lessonId: lesson.id });
        });
        stage.appendChild(card.mount());
        this.components.push(card);
      }
    }

    const btnBack = new Button('Quay lại', {
      variant: 'secondary',
      onClick: () => this.context.sceneManager.go('course-select')
    });
    stage.appendChild(btnBack.mount());
    this.components.push(btnBack);

    this.element.appendChild(stage);
  }
}
