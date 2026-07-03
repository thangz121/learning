import { logDebug, logWarn, logError } from '../constants/GameConfig.js';

/**
 * WebSpeechProvider - Web Speech API TTS provider.
 * @responsibility Provide TTS via browser SpeechSynthesis API.
 * @dependency GameConfig (for logging).
 * @lifecycle Created once, reused across AudioManager instances.
 *             Must cancel all speech when gameplay ends.
 */
export class WebSpeechProvider {
  #synth = null;
  #currentUtterance = null;
  #currentOnEnd = null;
  #currentOnError = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.#synth = window.speechSynthesis;
    }
  }

  speak(text, options = {}) {
    if (!this.#synth) {
      logWarn('WebSpeechProvider', 'Speech synthesis not supported');
      return null;
    }
    if (!text || typeof text !== 'string') {
      logWarn('WebSpeechProvider', 'Invalid text', { text });
      return null;
    }

    this.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = options.lang || 'vi-VN';
    u.volume = Math.max(0, Math.min(1, options.volume ?? 1));
    u.rate = Math.max(0.1, Math.min(10, options.rate ?? 0.9));
    u.pitch = Math.max(0, Math.min(2, options.pitch ?? 1));

    this.#currentOnEnd = () => {
      this.#currentUtterance = null;
      this.#currentOnEnd = null;
      this.#currentOnError = null;
      options.onend?.();
      logDebug('WebSpeechProvider', 'Speech ended', { text: text.substring(0, 30) });
    };

    this.#currentOnError = (e) => {
      this.#currentUtterance = null;
      this.#currentOnEnd = null;
      this.#currentOnError = null;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        logWarn('WebSpeechProvider', 'Speech error', { error: e.error, text: text.substring(0, 30) });
        options.onerror?.(e);
      }
    };

    u.addEventListener('end', this.#currentOnEnd, { once: true });
    u.addEventListener('error', this.#currentOnError, { once: true });

    this.#currentUtterance = u;
    this.#synth.speak(u);
    logDebug('WebSpeechProvider', 'Speaking', { text: text.substring(0, 50), lang: u.lang });
    return u;
  }

  cancel() {
    if (!this.#synth) return;
    try {
      this.#synth.cancel();
      // Clear all references to prevent callback after destroy
      if (this.#currentUtterance) {
        if (this.#currentOnEnd) {
          this.#currentUtterance.removeEventListener('end', this.#currentOnEnd);
        }
        if (this.#currentOnError) {
          this.#currentUtterance.removeEventListener('error', this.#currentOnError);
        }
      }
      this.#currentUtterance = null;
      this.#currentOnEnd = null;
      this.#currentOnError = null;
      logDebug('WebSpeechProvider', 'Cancelled');
    } catch (e) {
      logError('WebSpeechProvider', 'Cancel failed', e);
    }
  }

  pause() {
    if (!this.#synth) return;
    try { this.#synth.pause(); } catch (e) {
      logWarn('WebSpeechProvider', 'Pause failed', e);
    }
  }

  resume() {
    if (!this.#synth) return;
    try { this.#synth.resume(); } catch (e) {
      logWarn('WebSpeechProvider', 'Resume failed', e);
    }
  }

  isSpeaking() {
    return this.#synth ? this.#synth.speaking : false;
  }

  static isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}
