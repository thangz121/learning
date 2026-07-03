/**
 * @typedef {Object} CourseManifest
 * @property {string} id
 * @property {string} name
 * @property {string} [icon]
 * @property {string} [description]
 * @property {number} schemaVersion
 */

export class CourseSchema {
  static validate(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Course must be an object');
    const c = raw;
    if (typeof c.id !== 'string' || !c.id.trim()) throw new Error('id required');
    if (typeof c.name !== 'string' || !c.name.trim()) throw new Error('name required');
    return c;
  }
}
