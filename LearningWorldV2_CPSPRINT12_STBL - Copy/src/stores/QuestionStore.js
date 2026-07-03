import { BaseStore } from './BaseStore.js';
import { QuestionRecord } from '../models/QuestionRecord.js';

/**
 * QuestionStore - Manages QuestionRecord instances.
 */
export class QuestionStore extends BaseStore {
  constructor(eventBus) {
    super('question', eventBus);
  }

  /**
   * Get questions by lesson ID.
   */
  getByLesson(lessonId) {
    return this.find((r) => r.lessonId === lessonId);
  }

  /**
   * Get questions by tag.
   */
  getByTag(tag) {
    return this.find((r) => Array.isArray(r.tags) && r.tags.includes(tag));
  }

  /**
   * Get questions by type.
   */
  getByType(type) {
    return this.find((r) => r.type === type);
  }
}