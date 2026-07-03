import { BaseStore } from './BaseStore.js';
import { VersionRecord } from '../models/VersionRecord.js';

/**
 * VersionStore - Manages VersionRecord instances.
 */
export class VersionStore extends BaseStore {
  constructor(eventBus) {
    super('version', eventBus);
  }

  /**
   * Get versions by lesson ID.
   */
  getByLesson(lessonId) {
    return this.find((r) => r.lessonId === lessonId);
  }

  /**
   * Get latest version for a lesson.
   */
  getLatest(lessonId) {
    const versions = this.getByLesson(lessonId);
    return versions.sort((a, b) => b.createdAt - a.createdAt)[0] || null;
  }
}