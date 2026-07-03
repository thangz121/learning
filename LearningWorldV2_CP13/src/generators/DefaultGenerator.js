/**
 * DefaultGenerator - Generates write operations for questions.
 *
 * CONTRACT:
 *   generate(normalized) → Array<{ type, path, data }>
 *
 * Used by ImportPipelineV2 when no custom generator is set.
 */
export class DefaultGenerator {
  generate(normalized) {
    const questions = normalized.ast?.questions || [];
    return questions.map((q, i) => ({
      type: 'write',
      path: `question${String(i + 1).padStart(3, '0')}.js`,
      data: q,
    }));
  }
}
