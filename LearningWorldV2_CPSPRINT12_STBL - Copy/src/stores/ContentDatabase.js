import { CourseStore } from '../stores/CourseStore.js';
import { CategoryStore } from '../stores/CategoryStore.js';
import { LessonStore } from '../stores/LessonStore.js';
import { QuestionStore } from '../stores/QuestionStore.js';
import { AssetStore } from '../stores/AssetStore.js';
import { VersionStore } from '../stores/VersionStore.js';

/**
 * ContentDatabase - Aggregate of all stores. Source of Truth.
 *
 * CONTRACT:
 *   - Proxies all store operations
 *   - No business logic, only delegation
 *   - All data flows through here
 *   - Generated files are read-only reflections of this database
 *
 * RELATIONSHIP QUERIES:
 *   getCourseCategories(courseId) → CategoryRecord[]
 *   getCategoryLessons(courseId, categoryId) → LessonRecord[]
 *   getLessonQuestions(lessonId) → QuestionRecord[]
 *   getLessonAssets(lessonId) → AssetRecord[]
 *
 * BATCH EVENT:
 *   database:changed — emitted after any store mutation
 *   Payload: { action, store, timestamp }
 *   Use for UI refresh instead of listening to individual store events
 */
export class ContentDatabase {
  #eventBus = null;
  #courseStore = null;
  #categoryStore = null;
  #lessonStore = null;
  #questionStore = null;
  #assetStore = null;
  #versionStore = null;

  constructor(eventBus) {
    this.#eventBus = eventBus;
    this.#courseStore = new CourseStore(eventBus);
    this.#categoryStore = new CategoryStore(eventBus);
    this.#lessonStore = new LessonStore(eventBus);
    this.#questionStore = new QuestionStore(eventBus);
    this.#assetStore = new AssetStore(eventBus);
    this.#versionStore = new VersionStore(eventBus);

    this.#setupBatchEvent();
  }

  // === Store Access ===
  get courseStore() { return this.#courseStore; }
  get categoryStore() { return this.#categoryStore; }
  get lessonStore() { return this.#lessonStore; }
  get questionStore() { return this.#questionStore; }
  get assetStore() { return this.#assetStore; }
  get versionStore() { return this.#versionStore; }

  // === Relationship Queries ===
  getCourseCategories(courseId) {
    return this.#categoryStore.getByCourse(courseId);
  }

  getCategoryLessons(courseId, categoryId) {
    return this.#lessonStore.getByCourseAndCategory(courseId, categoryId);
  }

  getLessonQuestions(lessonId) {
    return this.#questionStore.getByLesson(lessonId);
  }

  getLessonAssets(lessonId) {
    return this.#assetStore.getByLesson(lessonId);
  }

  // === Clear All ===
  clear() {
    this.#courseStore.clear();
    this.#categoryStore.clear();
    this.#lessonStore.clear();
    this.#questionStore.clear();
    this.#assetStore.clear();
    this.#versionStore.clear();
  }

  #setupBatchEvent() {
    // Emit database:changed after any store mutation
    const stores = ['course', 'category', 'lesson', 'question', 'asset', 'version'];
    const actions = ['added', 'updated', 'removed', 'cleared'];
    for (const store of stores) {
      for (const action of actions) {
        this.#eventBus.on(`${store}:${action}`, (payload) => this.#emitDatabaseChanged(payload));
      }
    }
  }

  #emitDatabaseChanged(payload) {
    if (this.#eventBus) {
      this.#eventBus.emit('database:changed', {
        action: payload.action,
        store: payload.store,
        timestamp: Date.now(),
      });
    }
  }
}