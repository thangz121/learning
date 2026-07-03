import { ImportTransaction } from './ImportTransaction.js';
import { ImportReport } from './ImportReport.js';
import { ParserAdapter } from '../parsers/ParserAdapter.js';

/**
 * ImportPipeline V2 - Pure orchestrator. No business logic.
 *
 * CONTRACT:
 *   setParser(parser)
 *   setNormalizer(normalizer)
 *   setValidator(validator)
 *   setDuplicateDetector(detector)
 *   setGenerator(generator)
 *   setTransaction(transaction)
 *   setManifestBuilder(builder)
 *   run(input) → ImportReport
 *   simulate(input) → ImportReport (dry run)
 *
 * STEPS:
 *   Input → Parser → Normalizer → Validator → Duplicate Detector →
 *   Generator → Transaction → Commit → Report
 */
export class ImportPipelineV2 {
  #parser = null;
  #normalizer = null;
  #validator = null;
  #duplicateDetector = null;
  #generator = null;
  #transaction = null;
  #manifestBuilder = null;

  constructor(parser = null) {
    this.#parser = parser;
  }

  setParser(parser) { this.#parser = parser; return this; }
  setNormalizer(normalizer) { this.#normalizer = normalizer; return this; }
  setValidator(validator) { this.#validator = validator; return this; }
  setDuplicateDetector(detector) { this.#duplicateDetector = detector; return this; }
  setGenerator(generator) { this.#generator = generator; return this; }
  setTransaction(transaction) { this.#transaction = transaction; return this; }
  setManifestBuilder(builder) { this.#manifestBuilder = builder; return this; }

  async run(input) {
    const startTime = Date.now();
    const report = new ImportReport();

    try {
      // Step 1: Parse
      const parsed = await this.#parse(input, report);

      // Step 2: Normalize
      const normalized = await this.#normalize(parsed, report);

      // Step 3: Validate
      await this.#validate(normalized, report);

      // Step 4: Detect Duplicates
      await this.#detectDuplicates(normalized, report);

      // Step 5: Generate Operations
      const operations = await this.#generate(normalized, report);

      // Step 6: Transaction
      await this.#commit(operations, report);

      // Step 7: Manifest
      await this.#updateManifest(normalized, report);

      report.setDuration(startTime);
      report.success = operations.length;
      return report;
    } catch (error) {
      report.addError(error.message);
      report.rollback = true;
      report.failed = report.questions;
      report.setDuration(startTime);
      if (this.#transaction) {
        this.#transaction.rollback();
      }
      return report;
    }
  }

  async simulate(input) {
    const startTime = Date.now();
    const report = new ImportReport();

    try {
      const parsed = await this.#parse(input, report);
      const normalized = await this.#normalize(parsed, report);
      await this.#validate(normalized, report);
      await this.#detectDuplicates(normalized, report);
      const operations = await this.#generate(normalized, report);

      report.questions = operations.length;
      report.success = operations.length;
      report.setDuration(startTime);
      return report;
    } catch (error) {
      report.addError(error.message);
      report.failed = report.questions;
      report.setDuration(startTime);
      return report;
    }
  }

  // === Private Steps ===

  async #parse(input, report) {
    if (!this.#parser) {
      throw new Error('No parser set');
    }

    const parsed = this.#parser.parse(input);
    report.questions = parsed.ast.questions?.length || 0;
    return parsed;
  }

  async #normalize(parsed, report) {
    if (!this.#normalizer) return parsed;
    return this.#normalizer.normalize(parsed);
  }

  async #validate(normalized, report) {
    if (!this.#validator) return;
    const result = this.#validator.validate(normalized.ast);
    if (!result.valid) {
      result.errors.forEach((e) => report.addError(e));
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }
    if (result.warnings) {
      result.warnings.forEach((w) => report.addWarning(w));
    }
  }

  async #detectDuplicates(normalized, report) {
    if (!this.#duplicateDetector) return;
    const result = this.#duplicateDetector.detect(normalized.ast);
    if (result.duplicates?.length > 0) {
      result.duplicates.forEach((d) => report.addWarning(`Duplicate: ${d}`));
      report.skipped += result.duplicates.length;
    }
  }

  async #generate(normalized, report) {
    if (!this.#generator) {
      const questions = normalized.ast.questions || [];
      return questions.map((q, i) => ({
        type: 'write',
        path: `question${String(i + 1).padStart(3, '0')}.js`,
        data: q,
      }));
    }
    return this.#generator.generate(normalized);
  }

  async #commit(operations, report) {
    if (!this.#transaction) return;
    this.#transaction.begin();
    for (const op of operations) {
      this.#transaction.addOperation(op);
    }
    this.#transaction.commit();
    report.created = operations.length;
  }

  async #updateManifest(normalized, report) {
    if (!this.#manifestBuilder) return;
    // TODO: Update manifest via ManifestBuilder
    void normalized;
    void report;
  }
}