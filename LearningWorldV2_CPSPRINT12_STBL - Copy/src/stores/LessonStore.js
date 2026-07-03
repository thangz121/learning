import { BaseStore } from './BaseStore.js';
import { LessonRecord } from '../models/LessonRecord.js';

/**
 * LessonStore - Manages LessonRecord instances.
 */
export class LessonStore extends BaseStore {
  constructor(eventBus) {
    super('lesson', eventBus);
  }

  /**
   * Get lessons by course ID.
   */
  getByCourse(courseId) {
    return this.find((r) => r.courseId === courseId);
  }

  /**
   * Get lessons by category ID.
   */
  getByCategory(categoryId) {
    return this.find((r) => r.categoryId === categoryId);
  }

  /**
   * Get lessons by course and category.
   */
  getByCourseAndCategory(courseId, categoryId) {
    return this.find((r) => r.courseId === courseId && r.categoryId === categoryId);
  }
}