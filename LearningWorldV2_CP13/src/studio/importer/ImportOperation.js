/**
 * ImportOperation - Represents a single file operation in import transaction.
 */
export class ImportOperation {
  #type = null;
  #path = null;
  #data = null;

  constructor(type, path, data) {
    this.#type = type;
    this.#path = path;
    this.#data = data;
  }

  get type() { return this.#type; }
  get path() { return this.#path; }
  get data() { return this.#data; }

  toString() {
    return `${this.#type}: ${this.#path}`;
  }
}