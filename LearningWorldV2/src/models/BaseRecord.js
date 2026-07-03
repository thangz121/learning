import { ContentSchema } from './ContentSchema.js';

/**
 * BaseRecord - Abstract base for all content records.
 *
 * CONTRACT:
 *   schemaVersion — from ContentSchema.VERSION
 *   validate() → { valid: boolean, errors: string[], warnings: string[] }
 *   clone() → BaseRecord
 *   copyWith(changes) → BaseRecord
 *   equals(other) → boolean
 *   serialize() → string
 *   static deserialize(input) → BaseRecord
 *
 * SCHEMA VERSION CONTRACT:
 *   - Every record has schemaVersion from ContentSchema.VERSION
 *   - ImportPipeline checks schemaVersion before creating Record
 *   - If schemaVersion mismatch → pass through MigrationEngine
 *   - No record with wrong schemaVersion enters ContentDatabase
 */
export class BaseRecord {
  #schemaVersion = ContentSchema.VERSION;
  #id = null;
  #createdAt = null;
  #updatedAt = null;

  constructor(data = {}) {
    this.#id = data.id || this.#generateId();
    this.#createdAt = data.createdAt || Date.now();
    this.#updatedAt = data.updatedAt || this.#createdAt;
  }

  get schemaVersion() { return this.#schemaVersion; }
  get id() { return this.#id; }
  get createdAt() { return this.#createdAt; }
  get updatedAt() { return this.#updatedAt; }

  validate() {
    const errors = [];
    const warnings = [];
    if (!this.#schemaVersion) errors.push('schemaVersion is required');
    if (!this.#id) errors.push('id is required');
    return { valid: errors.length === 0, errors, warnings };
  }

  clone() {
    throw new Error('clone() must be implemented by subclass');
  }

  copyWith(changes) {
    const json = this.toJSON();
    return this.constructor.deserialize({ ...json, ...changes });
  }

  equals(other) {
    if (!(other instanceof BaseRecord)) return false;
    if (this.constructor !== other.constructor) return false;
    return this.#deepEqual(this.toJSON(), other.toJSON());
  }

  #deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.#deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  serialize() {
    return JSON.stringify(this.toJSON());
  }

  static deserialize(input) {
    throw new Error('deserialize() must be implemented by subclass');
  }

  toJSON() {
    return {
      schemaVersion: this.#schemaVersion,
      id: this.#id,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }

  touch() {
    this.#updatedAt = Date.now();
  }

  #generateId() {
    // TODO Sprint 14: Replace with UUID or IdGenerator
    return `${this.constructor.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}