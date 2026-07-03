import { LessonSchema } from '../schemas/LessonSchema.js';
import { CourseSchema } from '../schemas/CourseSchema.js';
import { CourseProvider } from '../providers/CourseProvider.js';
import { FileSystemCourseProvider } from '../providers/FileSystemCourseProvider.js';

/**
 * LessonRepository - Chỉ đọc metadata. Không đọc Question.
 *
 * CONTRACT:
 *   - Accepts CourseProvider via constructor (dependency injection)
 *   - Caches manifests in memory
 *   - Validates all manifests and lessons via Schema
 *   - Returns null/empty array on error, never throws for missing data
 *   - clearCache() invalidates all cached manifests
 */
export class LessonRepository {
  #manifests = new Map();
  #courseProvider;

  constructor(courseProvider = null) {
    this.#courseProvider = courseProvider || new FileSystemCourseProvider();
  }

  async #loadManifest(course) {
    if (this.#manifests.has(course)) return this.#manifests.get(course);
    const path = `../data/courses/${course}/manifest.js`;
    try {
      const module = await import(path);
      const raw = module.default || module;
      CourseSchema.validate(raw);
      raw.categories.forEach((cat) => {
        cat.lessons.forEach((l) => LessonSchema.validate(l));
      });
      this.#manifests.set(course, raw);
      return raw;
    } catch {
      return null;
    }
  }

  async getCourses() {
    return this.#courseProvider.getCourseIds();
  }

  async getCategories(course) {
    const m = await this.#loadManifest(course);
    return m ? m.categories.map((c) => ({ id: c.id, name: c.name })) : [];
  }

  async getLessons(course, categoryId) {
    const m = await this.#loadManifest(course);
    if (!m) return [];
    const cat = m.categories.find((c) => c.id === categoryId);
    return cat ? cat.lessons : [];
  }

  async getLesson(course, categoryId, lessonId) {
    const lessons = await this.getLessons(course, categoryId);
    return lessons.find((l) => l.id === lessonId) || null;
  }

  async getManifest(course) {
    return this.#loadManifest(course);
  }

  clearCache() {
    this.#manifests.clear();
  }
}