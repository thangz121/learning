/**
 * Logger - Centralized logging for Learning World.
 *
 * CONTRACT:
 *   Logger.for(module) → Logger instance
 *   log(message, data)
 *   warn(message, data)
 *   error(message, data)
 *
 * Only logs when GameConfig.debug is true.
 */
export class Logger {
  static #loggers = new Map();

  static for(module) {
    if (!this.#loggers.has(module)) {
      this.#loggers.set(module, new Logger(module));
    }
    return this.#loggers.get(module);
  }

  #module = '';

  constructor(module) {
    this.#module = module;
  }

  log(message, data) {
    this.#emit('log', message, data);
  }

  warn(message, data) {
    this.#emit('warn', message, data);
  }

  error(message, data) {
    this.#emit('error', message, data);
  }

  #emit(level, message, data) {
    // Only log in debug mode
    if (typeof window !== 'undefined' && window.__DEBUG__) {
      // eslint-disable-next-line no-console
      console[level](`[${this.#module}]`, message, data || '');
    }
  }
}