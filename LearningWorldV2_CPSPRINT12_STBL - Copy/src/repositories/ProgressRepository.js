import { Storage } from '../core/Storage.js';

/**
 * ProgressRepository - Lưu/đọc tiến trình.
 */
export class ProgressRepository {
  constructor() { this.storage = new Storage('lw2_progress'); }

  load(course, lessonId) {
    return this.storage.load(`${course}:${lessonId}`);
  }

  save(course, lessonId, data) {
    return this.storage.save(`${course}:${lessonId}`, data);
  }

  reset(course, lessonId) {
    this.storage.remove(`${course}:${lessonId}`);
  }

  clear() { this.storage.clear(); }
}
