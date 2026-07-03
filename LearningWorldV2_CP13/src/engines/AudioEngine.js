import { AnswerCode } from '../constants/AnswerCode.js';

/**
 * AudioEngine - Điều phối âm thanh gameplay.
 */
export class AudioEngine {
  #manager = null;

  initialize(manager) { this.#manager = manager; }

  playStory(path) { this.#play(path, 'story'); }
  playQuestion(path) { this.#play(path, 'question'); }
  playChoice(path) { this.#play(path, 'choice'); }
  playFeedback(type) { this.#playEffect(type); }
  stopAll() { this.#manager?.stopAll(); }
  stopChannel(channel) { this.#manager?.stop(channel); }
  dispose() { this.#manager = null; }

  #play(path, channel) {
    if (!this.#manager || !path) return;
    this.#manager.play(path, { channel });
  }

  #playEffect(type) {
    if (!this.#manager) return;
    const map = {
      success: 'assets/audio/effects/success.mp3',
      retry: 'assets/audio/effects/retry.mp3',
    };
    const path = map[type];
    if (path) this.#manager.play(path, { channel: 'effect' });
  }
}
