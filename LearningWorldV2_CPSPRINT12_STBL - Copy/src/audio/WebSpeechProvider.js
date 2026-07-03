/**
 * WebSpeechProvider - Web Speech API TTS provider.
 */
export class WebSpeechProvider {
  #synth = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.#synth = window.speechSynthesis;
    }
  }

  speak(text, options = {}) {
    if (!this.#synth) return null;
    this.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = options.lang || 'vi-VN';
    u.volume = Math.max(0, Math.min(1, options.volume ?? 1));
    u.rate = Math.max(0.1, Math.min(10, options.rate ?? 0.9));
    u.pitch = Math.max(0, Math.min(2, options.pitch ?? 1));
    u.onend = () => {
      options.onend?.();
    };
    u.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        options.onerror?.(e);
      }
    };
    this.#synth.speak(u);
    return u;
  }

  cancel() {
    if (this.#synth) {
      try { this.#synth.cancel(); } catch {}
    }
  }

  pause() {
    if (this.#synth) {
      try { this.#synth.pause(); } catch {}
    }
  }

  resume() {
    if (this.#synth) {
      try { this.#synth.resume(); } catch {}
    }
  }

  isSpeaking() {
    return this.#synth ? this.#synth.speaking : false;
  }

  static isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}
