import { BaseRecord } from './BaseRecord.js';

/**
 * LessonRecord - Represents a lesson within a category.
 */
export class LessonRecord extends BaseRecord {
  #courseId = '';
  #categoryId = '';
  #title = '';
  #order = 0;
  #questionIds = [];
  #metadata = {};

  constructor(data = {}) {
    super(data);
    this.#courseId = data.courseId || '';
    this.#categoryId = data.categoryId || '';
    this.#title = data.title || '';
    this.#order = data.order || 0;
    this.#questionIds = Array.isArray(data.questionIds) ? data.questionIds : [];
    this.#metadata = data.metadata || {};
  }

  get courseId() { return this.#courseId; }
  get categoryId() { return this.#categoryId; }
  get title() { return this.#title; }
  get order() { return this.#order; }
  get questionIds() { return [...this.#questionIds]; }
  get metadata() { return { ...this.#metadata }; }

  validate() {
    const base = super.validate();
    if (!this.#courseId) base.errors.push('courseId is required');
    if (!this.#categoryId) base.errors.push('categoryId is required');
    if (!this.#title) base.errors.push('title is required');
    if (this.#questionIds.length === 0) base.warnings.push('lesson has no questions');
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new LessonRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new LessonRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      courseId: this.#courseId,
      categoryId: this.#categoryId,
      title: this.#title,
      order: this.#order,
      questionIds: [...this.#questionIds],
      metadata: { ...this.#metadata },
    };
  }
}