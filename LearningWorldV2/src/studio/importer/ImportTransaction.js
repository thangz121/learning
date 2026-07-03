import { ImportOperation } from './ImportOperation.js';

/**
 * ImportTransaction - Transaction wrapper for import operations.
 *
 * CONTRACT:
 *   begin()     — start transaction
 *   validate()  — validate input
 *   generate()  — generate folder structure, returns ImportOperation[]
 *   write()     — write to file system
 *   commit()    — finalize
 *   rollback()  — undo all changes on error
 *
 * State machine:
 *   IDLE → BEGIN → VALIDATED → GENERATED → WRITTEN → COMMITTED
 *   Any state can transition to ROLLBACK on error.
 */
export class ImportTransaction {
  #state = 'IDLE';
  #operations = [];
  #rolledBack = false;

  begin() {
    if (this.#state !== 'IDLE') {
      throw new Error(`Cannot begin transaction from state: ${this.#state}`);
    }
    this.#state = 'BEGIN';
    this.#operations = [];
    this.#rolledBack = false;
  }

  validate(fn) {
    this.#ensureState('BEGIN');
    const result = fn();
    if (!result.valid) {
      throw new Error(result.error || 'Validation failed');
    }
    this.#state = 'VALIDATED';
  }

  generate(fn) {
    this.#ensureState('VALIDATED');
    const ops = fn();
    if (!Array.isArray(ops)) {
      throw new Error('generate() must return an array of ImportOperation');
    }
    for (const op of ops) {
      if (!(op instanceof ImportOperation)) {
        throw new Error('All operations must be ImportOperation instances');
      }
    }
    this.#operations = ops;
    this.#state = 'GENERATED';
    return this.#operations;
  }

  write(fn) {
    this.#ensureState('GENERATED');
    fn(this.#operations);
    this.#state = 'WRITTEN';
  }

  commit() {
    this.#ensureState('WRITTEN');
    this.#state = 'COMMITTED';
  }

  rollback() {
    if (this.#rolledBack) return;
    this.#rolledBack = true;
    // TODO: Implement undo via FileSystemProvider
    // For each operation in reverse order, delete created files
    this.#state = 'ROLLBACK';
  }

  getState() {
    return this.#state;
  }

  getOperations() {
    return [...this.#operations];
  }

  #ensureState(expected) {
    if (this.#state !== expected) {
      throw new Error(`Expected state ${expected}, got ${this.#state}`);
    }
  }
}