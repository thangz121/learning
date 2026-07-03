import { BaseRecord } from './BaseRecord.js';

/**
 * CategoryRecord - Represents a category within a course.
 */
export class CategoryRecord extends BaseRecord {
  #courseId = '';
  #name = '';
  #order = 0;
  #lessons = [];
  #metadata = {};

  constructor(data = {}) {
    super(data);
    this.#courseId = data.courseId || '';
    this.#name = data.name || '';
    this.#order = data.order || 0;
    this.#lessons = Array.isArray(data.lessons) ? data.lessons : [];
    this.#metadata = data.metadata || {};
  }

  get courseId() { return this.#courseId; }
  get name() { return this.#name; }
  get order() { return this.#order; }
  get lessons() { return [...this.#lessons]; }
  get metadata() { return { ...this.#metadata }; }

  validate() {
    const base = super.validate();
    if (!this.#courseId) base.errors.push('courseId is required');
    if (!this.#name) base.errors.push('name is required');
    if (this.#lessons.length === 0) base.warnings.push('category has no lessons');
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new CategoryRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new CategoryRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      courseId: this.#courseId,
      name: this.#name,
      order: this.#order,
      lessons: [...this.#lessons],
      metadata: { ...this.#metadata },
    };
  }
}