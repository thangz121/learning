/**
 * ManifestBuilder - Automatically updates course manifest.
 *
 * CONTRACT:
 *   addLesson(manifest, categoryId, lesson) — add lesson to manifest
 *   removeLesson(manifest, categoryId, lessonId) — remove lesson
 *   updateLesson(manifest, categoryId, lesson) — update lesson metadata
 *
 * All operations clone first, then mutate clone, then return clone.
 * Original manifest is never modified.
 */
export class ManifestBuilder {
  addLesson(manifest, categoryId, lesson) {
    const clone = this.#clone(manifest);
    const cat = clone.categories.find((c) => c.id === categoryId);
    if (!cat) {
      throw new Error(`Category "${categoryId}" not found`);
    }
    const existing = cat.lessons.find((l) => l.id === lesson.id);
    if (existing) {
      throw new Error(`Lesson "${lesson.id}" already exists`);
    }
    cat.lessons.push(lesson);
    cat.lessons.sort((a, b) => a.id.localeCompare(b.id));
    return clone;
  }

  removeLesson(manifest, categoryId, lessonId) {
    const clone = this.#clone(manifest);
    const cat = clone.categories.find((c) => c.id === categoryId);
    if (!cat) {
      throw new Error(`Category "${categoryId}" not found`);
    }
    cat.lessons = cat.lessons.filter((l) => l.id !== lessonId);
    return clone;
  }

  updateLesson(manifest, categoryId, lesson) {
    const clone = this.#clone(manifest);
    const cat = clone.categories.find((c) => c.id === categoryId);
    if (!cat) {
      throw new Error(`Category "${categoryId}" not found`);
    }
    const idx = cat.lessons.findIndex((l) => l.id === lesson.id);
    if (idx === -1) {
      throw new Error(`Lesson "${lesson.id}" not found`);
    }
    cat.lessons[idx] = lesson;
    return clone;
  }

  #clone(obj) {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
  }
}