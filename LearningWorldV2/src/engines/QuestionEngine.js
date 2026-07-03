/**
 * QuestionEngine - Quản lý Question Flow.
 */
export class QuestionEngine {
  #questions = [];
  #index = 0;

  initialize() { this.#questions = []; this.#index = 0; }

  load(questions) {
    if (!Array.isArray(questions)) throw new Error('Questions must be array');
    this.#questions = questions.map((q) => this.#clone(q));
    this.#index = 0;
  }

  current() {
    if (this.#questions.length === 0) return null;
    return this.#clone(this.#questions[this.#index]);
  }

  next() {
    if (this.#index < this.#questions.length - 1) { this.#index++; return true; }
    return false;
  }

  previous() {
    if (this.#index > 0) { this.#index--; return true; }
    return false;
  }

  isFinished() { return this.#index >= this.#questions.length - 1; }
  count() { return this.#questions.length; }
  currentIndex() { return this.#index; }
  progress() { return this.count() <= 1 ? 1 : this.#index / (this.count() - 1); }

  reset() { this.#index = 0; }

  destroy() { this.#questions = []; this.#index = 0; }

  #clone(q) {
    if (typeof structuredClone === 'function') return structuredClone(q);
    return JSON.parse(JSON.stringify(q));
  }
}
