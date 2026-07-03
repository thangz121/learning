import { ParserAdapter } from './ParserAdapter.js';

/**
 * JSONParser - Parses JSON string into AST.
 */
export class JSONParser extends ParserAdapter {
  parse(input) {
    if (typeof input !== 'string') {
      throw new Error('JSONParser: input must be a string');
    }

    try {
      const ast = JSON.parse(input);
      return { format: 'json', ast, raw: input };
    } catch (err) {
      throw new Error(`JSONParser: invalid JSON - ${err.message}`);
    }
  }

  detectFormat(input) {
    if (typeof input !== 'string') return 'unknown';
    try {
      JSON.parse(input);
      return 'json';
    } catch {
      return 'unknown';
    }
  }
}