import { BaseRecord } from './BaseRecord.js';

/**
 * CourseRecord - Represents a course in Learning World.
 */
export class CourseRecord extends BaseRecord {
  #name = '';
  #language = 'vi';
  #description = '';
  #icon = '';
  #color = '';
  #categories = [];
  #metadata = {};

  constructor(data = {}) {
    super(data);
    this.#name = data.name || '';
    this.#language = data.language || 'vi';
    this.#description = data.description || '';
    this.#icon = data.icon || '';
    this.#color = data.color || '';
    this.#categories = Array.isArray(data.categories) ? data.categories : [];
    this.#metadata = data.metadata || {};
  }

  get name() { return this.#name; }
  get language() { return this.#language; }
  get description() { return this.#description; }
  get icon() { return this.#icon; }
  get color() { return this.#color; }
  get categories() { return [...this.#categories]; }
  get metadata() { return { ...this.#metadata }; }

  validate() {
    const base = super.validate();
    if (!this.#name) base.errors.push('name is required');
    if (!this.#language) base.errors.push('language is required');
    if (this.#categories.length === 0) base.warnings.push('course has no categories');
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new CourseRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new CourseRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      language: this.#language,
      description: this.#description,
      icon: this.#icon,
      color: this.#color,
      categories: [...this.#categories],
      metadata: { ...this.#metadata },
    };
  }
}