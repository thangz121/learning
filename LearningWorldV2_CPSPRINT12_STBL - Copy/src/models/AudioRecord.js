import { AssetRecord } from './AssetRecord.js';

/**
 * AudioSource - Enum for audio source types.
 */
export const AudioSource = Object.freeze({
  LOCAL: 'local',
  TTS_BROWSER: 'tts_browser',
  TTS_AZURE: 'tts_azure',
  TTS_ELEVENLABS: 'tts_elevenlabs',
  TTS_OPENAI: 'tts_openai',
});

/**
 * AudioRecord - Represents an audio asset with voice profile.
 */
export class AudioRecord extends AssetRecord {
  #duration = 0;
  #voiceProfile = null;
  #transcript = '';
  #source = AudioSource.LOCAL;

  constructor(data = {}) {
    super(data);
    this.#duration = data.duration || 0;
    this.#voiceProfile = data.voiceProfile || null;
    this.#transcript = data.transcript || '';
    this.#source = data.source || AudioSource.LOCAL;
  }

  get duration() { return this.#duration; }
  get voiceProfile() { return this.#voiceProfile; }
  get transcript() { return this.#transcript; }
  get source() { return this.#source; }
  get isTTS() { return this.#source !== AudioSource.LOCAL; }

  validate() {
    const base = super.validate();
    if (!this.#transcript && !this.isTTS) {
      base.errors.push('transcript is required for non-TTS audio');
    }
    if (!Object.values(AudioSource).includes(this.#source)) {
      base.errors.push(`invalid audio source: ${this.#source}`);
    }
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new AudioRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new AudioRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duration: this.#duration,
      voiceProfile: this.#voiceProfile,
      transcript: this.#transcript,
      source: this.#source,
    };
  }
}