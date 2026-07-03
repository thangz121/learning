import { ImportTransaction } from './ImportTransaction.js';
import { ImportOperation } from './ImportOperation.js';

/**
 * ImportPipeline - Orchestrates the 7-step import process.
 *
 * Steps:
 *   Input → Parser → Validator → Folder Generator → Asset Resolver → Preview → Import → Manifest Builder
 *
 * CONTRACT:
 *   run(input)     — full import with transaction
 *   simulate(input) — dry run, no file writes
 */
export class ImportPipeline {
  #transaction = null;

  constructor() {
    this.#transaction = new ImportTransaction();
  }

  async run(input) {
    this.#transaction.begin();

    try {
      const parsed = this.#parse(input);
      this.#transaction.validate(() => this.#validate(parsed));
      const operations = this.#transaction.generate(() => this.#generate(parsed));
      this.#transaction.write(() => this.#executeWrite(operations));
      this.#transaction.commit();

      return { success: true, state: this.#transaction.getState(), operations: operations.length };
    } catch (error) {
      this.#transaction.rollback();
      return { success: false, error: error.message, state: this.#transaction.getState() };
    }
  }

  async simulate(input) {
    this.#transaction.begin();

    try {
      const parsed = this.#parse(input);
      this.#transaction.validate(() => this.#validate(parsed));
      const operations = this.#transaction.generate(() => this.#generate(parsed));
      return { success: true, state: this.#transaction.getState(), operations: operations.length, dryRun: true };
    } catch (error) {
      this.#transaction.rollback();
      return { success: false, error: error.message, state: this.#transaction.getState() };
    }
  }

  #parse(input) {
    // TODO: Implement JSParser, JSONParser
    return { raw: input, questions: [] };
  }

  #validate(parsed) {
    // TODO: Implement SchemaValidator
    if (!parsed.raw || typeof parsed.raw !== 'string') {
      return { valid: false, error: 'Input must be a non-empty string' };
    }
    return { valid: true };
  }

  #generate(parsed) {
    // TODO: Implement FolderGenerator, AssetResolver
    const operations = [];
    // Placeholder: generate one operation per question
    for (let i = 0; i < parsed.questions.length; i++) {
      operations.push(new ImportOperation('write', `question${String(i + 1).padStart(3, '0')}/question.js`, parsed.questions[i]));
    }
    return operations;
  }

  #executeWrite(operations) {
    // TODO: Implement via FileSystemProvider
    // Placeholder: validate operations are well-formed
    for (const op of operations) {
      if (!op.path || !op.type) {
        throw new Error('Invalid operation: missing path or type');
      }
    }
  }
}