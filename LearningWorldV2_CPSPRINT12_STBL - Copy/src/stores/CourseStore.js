import { BaseStore } from './BaseStore.js';
import { CourseRecord } from '../models/CourseRecord.js';

/**
 * CourseStore - Manages CourseRecord instances.
 */
export class CourseStore extends BaseStore {
  constructor(eventBus) {
    super('course', eventBus);
  }

  /**
   * Find courses by language.
   */
  findByLanguage(language) {
    return this.find((r) => r.language === language);
  }

  /**
   * Find courses by name (partial match).
   */
  findByName(name) {
    const lower = name.toLowerCase();
    return this.find((r) => r.name.toLowerCase().includes(lower));
  }
}