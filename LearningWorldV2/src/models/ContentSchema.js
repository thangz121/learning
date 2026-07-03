/**
 * ContentSchema - Central schema configuration for Learning World.
 *
 * CONTRACT:
 *   VERSION — current schema version (semantic versioning)
 *   All records use this version
 *   MigrationEngine checks against this version
 */
export const ContentSchema = Object.freeze({
  VERSION: '13.0',
  MIN_VERSION: '13.0',
  MAX_VERSION: '13.0',
});