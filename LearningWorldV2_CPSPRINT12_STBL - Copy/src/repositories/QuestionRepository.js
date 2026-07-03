import { QuestionSchema } from '../schemas/QuestionSchema.js';

/**
 * QuestionRepository - Chỉ đọc Question. Không đọc Manifest/Progress.
 */
export class QuestionRepository {
  #cache = new Map();

  async loadLesson(course, category, lessonId) {
    const key = `${course}/${category}/${lessonId}`;
    if (this.#cache.has(key)) {
      return this.#cache.get(key).map((q) => this.#clone(q));
    }

    const path = `../data/courses/${course}/${category}/${lessonId}.js`;
    const module = await import(path);
    const raw = module.default || module;

    if (!Array.isArray(raw)) throw new Error(`Lesson ${lessonId} must export array`);

    const validated = QuestionSchema.validateList(raw);
    this.#cache.set(key, validated);
    return validated.map((q) => this.#clone(q));
  }

  getQuestions(course, category, lessonId) {
    const key = `${course}/${category}/${lessonId}`;
    const cached = this.#cache.get(key);
    return cached ? cached.map((q) => this.#clone(q)) : null;
  }

  clearCache() { this.#cache.clear(); }

  #clone(q) {
    if (typeof structuredClone === 'function') return structuredClone(q);
    return JSON.parse(JSON.stringify(q));
  }
}
