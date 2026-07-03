/**
 * ImportReport - Result of import operation.
 *
 * FIELDS:
 *   questions, images, audio, stories, choices
 *   created, updated, skipped, success, failed
 *   missing, downloaded, placeholders, tts
 *   duration, warnings, performance, rollback, errors, sourceFormat
 */
export class ImportReport {
  constructor(data = {}) {
    this.questions = data.questions || 0;
    this.images = data.images || 0;
    this.audio = data.audio || 0;
    this.stories = data.stories || 0;
    this.choices = data.choices || 0;
    this.created = data.created || 0;
    this.updated = data.updated || 0;
    this.skipped = data.skipped || 0;
    this.success = data.success || 0;
    this.failed = data.failed || 0;
    this.missing = data.missing || [];
    this.downloaded = data.downloaded || 0;
    this.placeholders = data.placeholders || 0;
    this.tts = data.tts || 0;
    this.duration = data.duration || 0;
    this.warnings = data.warnings || [];
    this.performance = data.performance || {};
    this.rollback = data.rollback || false;
    this.errors = data.errors || [];
    this.sourceFormat = data.sourceFormat || '';
  }

  addWarning(warning) {
    this.warnings.push(warning);
  }

  addError(error) {
    this.errors.push(error);
  }

  setDuration(startTime) {
    this.duration = Date.now() - startTime;
  }

  toJSON() {
    return {
      questions: this.questions,
      images: this.images,
      audio: this.audio,
      stories: this.stories,
      choices: this.choices,
      created: this.created,
      updated: this.updated,
      skipped: this.skipped,
      success: this.success,
      failed: this.failed,
      missing: this.missing,
      downloaded: this.downloaded,
      placeholders: this.placeholders,
      tts: this.tts,
      duration: this.duration,
      warnings: this.warnings,
      performance: this.performance,
      rollback: this.rollback,
      errors: this.errors,
      sourceFormat: this.sourceFormat,
    };
  }
}