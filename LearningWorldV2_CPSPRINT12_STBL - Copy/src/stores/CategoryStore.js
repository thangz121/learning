import { BaseStore } from './BaseStore.js';
import { CategoryRecord } from '../models/CategoryRecord.js';

/**
 * CategoryStore - Manages CategoryRecord instances.
 */
export class CategoryStore extends BaseStore {
  constructor(eventBus) {
    super('category', eventBus);
  }

  /**
   * Get categories by course ID.
   */
  getByCourse(courseId) {
    return this.find((r) => r.courseId === courseId);
  }
}