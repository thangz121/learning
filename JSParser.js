import { ParserAdapter } from './ParserAdapter.js';

/**
 * JSParser - Parses JavaScript module exports into AST.
 *
 * CONTRACT:
 *   - ONLY supports: export default { ... } with simple object literal
 *   - Does NOT support: functions, regex, expressions, nested objects with methods
 *   - All values must be: string, number, boolean, null, array, or plain object
 *   - Keys can be unquoted (will be quoted automatically)
 *
 * SUPPORTED:
 *   export default {
 *     name: 'Lesson 1',
 *     questions: [
 *       { text: 'What is...', choices: ['A', 'B'] }
 *     ]
 *   }
 *
 * NOT SUPPORTED:
 *   export default { fn() {}, regex: /abc/, expr: 1 + 2 }
 */
export class JSParser extends ParserAdapter {
  parse(input) {
    if (typeof input !== 'string') {
      throw new Error('JSParser: input must be a string');
    }

    // Extract the object literal from export default
    const exportDefaultMatch = input.match(/export\s+default\s+({[\s\S]*})/);
    const moduleExportsMatch = input.match(/module\.exports\s*=\s*({[\s\S]*})/);

    let objectLiteral = null;
    if (exportDefaultMatch) {
      objectLiteral = exportDefaultMatch[1];
    } else if (moduleExportsMatch) {
      objectLiteral = moduleExportsMatch[1];
    }

    if (!objectLiteral) {
      throw new Error('JSParser: no export default or module.exports found');
    }

    // Validate: reject function declarations, regex literals, expressions
    if (/function\s*\(/.test(objectLiteral) || /=>/.test(objectLiteral)) {
      throw new Error('JSParser: functions are not supported');
    }
    if (/\/[^/]+\//.test(objectLiteral)) {
      throw new Error('JSParser: regex literals are not supported');
    }

    // Convert to valid JSON by wrapping keys in quotes
    const jsonLike = objectLiteral
      .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
      .replace(/'/g, '"');

    try {
      const ast = JSON.parse(jsonLike);
      return { format: 'js', ast, raw: input };
    } catch (err) {
      throw new Error(`JSParser: invalid object literal - ${err.message}`);
    }
  }

  detectFormat(input) {
    if (typeof input !== 'string') return 'unknown';
    if (/export\s+default/.test(input)) return 'js';
    if (/module\.exports/.test(input)) return 'js';
    return 'unknown';
  }
}