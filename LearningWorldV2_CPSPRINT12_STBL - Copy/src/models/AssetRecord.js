import { BaseRecord } from './BaseRecord.js';

/**
 * AssetRecord - Represents a generic asset (file reference).
 */
export class AssetRecord extends BaseRecord {
  #lessonId = '';
  #questionId = '';
  #type = ''; // 'image', 'audio', 'video', 'document'
  #filename = '';
  #path = '';
  #size = 0;
  #mimeType = '';
  #hash = '';
  #hashAlgorithm = ''; // 'sha256', 'md5', etc.
  #metadata = {};

  constructor(data = {}) {
    super(data);
    this.#lessonId = data.lessonId || '';
    this.#questionId = data.questionId || '';
    this.#type = data.type || '';
    this.#filename = data.filename || '';
    this.#path = data.path || '';
    this.#size = data.size || 0;
    this.#mimeType = data.mimeType || '';
    this.#hash = data.hash || '';
    this.#hashAlgorithm = data.hashAlgorithm || '';
    this.#metadata = data.metadata || {};
  }

  get lessonId() { return this.#lessonId; }
  get questionId() { return this.#questionId; }
  get type() { return this.#type; }
  get filename() { return this.#filename; }
  get path() { return this.#path; }
  get size() { return this.#size; }
  get mimeType() { return this.#mimeType; }
  get hash() { return this.#hash; }
  get hashAlgorithm() { return this.#hashAlgorithm; }
  get metadata() { return { ...this.#metadata }; }

  validate() {
    const base = super.validate();
    if (!this.#type) base.errors.push('type is required');
    if (!this.#filename) base.errors.push('filename is required');
    if (!this.#path) base.errors.push('path is required');
    if (!this.#hash) base.warnings.push('asset has no hash (checksum)');
    if (this.#hash && !this.#hashAlgorithm) base.warnings.push('asset has hash but no algorithm specified');
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new AssetRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new AssetRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      lessonId: this.#lessonId,
      questionId: this.#questionId,
      type: this.#type,
      filename: this.#filename,
      path: this.#path,
      size: this.#size,
      mimeType: this.#mimeType,
      hash: this.#hash,
      hashAlgorithm: this.#hashAlgorithm,
      metadata: { ...this.#metadata },
    };
  }
}