import { LessonSchema } from '../schemas/LessonSchema.js';
import { CourseSchema } from '../schemas/CourseSchema.js';

/**
 * LessonRepository - Chỉ đọc metadata. Không đọc Question.
 */
export class LessonRepository {
  #manifests = new Map();

  async #loadManifest(course) {
    if (this.#manifests.has(course)) return this.#manifests.get(course);
    const path = `../data/courses/${course}/manifest.js`;
    try {
      const module = await import(path);
	  console.log(path);
console.log(module);
      const raw = module.default || module;
      CourseSchema.validate(raw);
      raw.categories.forEach((cat) => {
        cat.lessons.forEach((l) => LessonSchema.validate(l));
      });
      this.#manifests.set(course, raw);
      return raw;
    } catch (err) {
  console.error("LessonRepository:", err);
  return null;
}
  }

  async getCourses() {
    return ['vietnamese']; // Future: dynamic discovery
  }

  async getCategories(course) {
    const m = await this.#loadManifest(course);
	console.log("Manifest:", m);
console.log("Categories:", m?.categories);
    return m ? m.categories.map((c) => ({ id: c.id, name: c.name })) : [];
  }

  async getLessons(course, categoryId) {
    const m = await this.#loadManifest(course);
    if (!m) return [];
    const cat = m.categories.find((c) => c.id === categoryId);
    return cat ? cat.lessons : [];
	console.log("Category:", categoryId);
console.log("Lessons:", cat?.lessons);
  }

  async getLesson(course, categoryId, lessonId) {
    const lessons = await this.getLessons(course, categoryId);
    return lessons.find((l) => l.id === lessonId) || null;
  }

  async getManifest(course) {
    return this.#loadManifest(course);
  }
}
