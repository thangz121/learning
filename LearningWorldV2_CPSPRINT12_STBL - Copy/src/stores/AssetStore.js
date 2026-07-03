import { BaseStore } from './BaseStore.js';
import { AssetRecord } from '../models/AssetRecord.js';

/**
 * AssetStore - Manages AssetRecord instances (images, audio, etc.).
 */
export class AssetStore extends BaseStore {
  constructor(eventBus) {
    super('asset', eventBus);
  }

  /**
   * Get assets by lesson ID.
   */
  getByLesson(lessonId) {
    return this.find((r) => r.lessonId === lessonId);
  }

  /**
   * Get assets by question ID.
   */
  getByQuestion(questionId) {
    return this.find((r) => r.questionId === questionId);
  }

  /**
   * Get assets by type.
   */
  getByType(type) {
    return this.find((r) => r.type === type);
  }
}