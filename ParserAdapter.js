/**
 * ParserAdapter - Interface for content parsers.
 *
 * CONTRACT:
 *   parse(input) → AST
 *   detectFormat(input) → string
 *   canParse(input) → boolean (uses detectFormat, NOT parse)
 *
 * IMPLEMENTATIONS:
 *   JSParser, JSONParser, YAMLParser (future), MarkdownParser (future), AIParser (future)
 */
export class ParserAdapter {
  parse(input) {
    throw new Error('ParserAdapter.parse() must be implemented');
  }

  detectFormat(input) {
    throw new Error('ParserAdapter.detectFormat() must be implemented');
  }

  canParse(input) {
    return this.detectFormat(input) !== 'unknown';
  }
}