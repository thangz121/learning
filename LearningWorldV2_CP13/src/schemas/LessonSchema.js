/**
 * @typedef {Object} LessonManifest
 * @property {string} id
 * @property {string} title
 * @property {string} course
 * @property {string} category
 * @property {number} difficulty
 * @property {number} duration
 * @property {string} [image]
 * @property {string} [description]
 * @property {number} schemaVersion
 */

/**
 * Validates lesson metadata.
 */
export class LessonSchema {
  static validate(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Lesson metadata must be an object');
    const m = raw;
    if (typeof m.id !== 'string' || !m.id.trim()) throw new Error('id required');
    if (typeof m.title !== 'string' || !m.title.trim()) throw new Error('title required');
    if (typeof m.difficulty !== 'number') throw new Error('difficulty must be number');
    return m;
  }
}
