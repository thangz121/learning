import { AssetRecord } from './AssetRecord.js';

/**
 * ImageSource - Enum for image source types.
 */
export const ImageSource = Object.freeze({
  LOCAL: 'local',
  PROVIDER: 'provider',
  PLACEHOLDER: 'placeholder',
});

/**
 * ImageRecord - Represents an image asset with style profile.
 */
export class ImageRecord extends AssetRecord {
  #width = 0;
  #height = 0;
  #alt = '';
  #styleProfile = null;
  #source = ImageSource.LOCAL;

  constructor(data = {}) {
    super(data);
    this.#width = data.width || 0;
    this.#height = data.height || 0;
    this.#alt = data.alt || '';
    this.#styleProfile = data.styleProfile || null;
    this.#source = data.source || ImageSource.LOCAL;
  }

  get width() { return this.#width; }
  get height() { return this.#height; }
  get alt() { return this.#alt; }
  get styleProfile() { return this.#styleProfile; }
  get source() { return this.#source; }
  get isPlaceholder() { return this.#source === ImageSource.PLACEHOLDER; }

  validate() {
    const base = super.validate();
    if (!this.#alt && !this.isPlaceholder) {
      base.errors.push('alt is required for non-placeholder images');
    }
    if (!Object.values(ImageSource).includes(this.#source)) {
      base.errors.push(`invalid image source: ${this.#source}`);
    }
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new ImageRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new ImageRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      width: this.#width,
      height: this.#height,
      alt: this.#alt,
      styleProfile: this.#styleProfile,
      source: this.#source,
    };
  }
}