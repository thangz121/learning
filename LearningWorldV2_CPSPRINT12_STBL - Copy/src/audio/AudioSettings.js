import { GameConfig } from '../constants/GameConfig.js';

/**
 * AudioSettings - Quản lý cài đặt âm thanh.
 */
export class AudioSettings {
  #repository;
  #data = {
    muted: false,
    musicVolume: GameConfig.audio.defaultMusicVolume,
    voiceVolume: GameConfig.audio.defaultVoiceVolume,
    effectVolume: GameConfig.audio.defaultEffectVolume,
  };

  constructor(settingsRepository) {
    this.#repository = settingsRepository;
    this.#load();
  }

  #load() {
    const saved = this.#repository.load('audio');
    if (saved) {
      this.#data.muted = saved.muted ?? this.#data.muted;
      this.#data.musicVolume = saved.musicVolume ?? this.#data.musicVolume;
      this.#data.voiceVolume = saved.voiceVolume ?? this.#data.voiceVolume;
      this.#data.effectVolume = saved.effectVolume ?? this.#data.effectVolume;
    }
  }

  save() {
    this.#repository.save('audio', { ...this.#data });
  }

  isMuted() { return this.#data.muted; }
  setMuted(v) { this.#data.muted = v; this.save(); }

  getMusicVolume() { return this.#data.musicVolume; }
  setMusicVolume(v) { this.#data.musicVolume = Math.max(0, Math.min(1, v)); this.save(); }

  getVoiceVolume() { return this.#data.voiceVolume; }
  setVoiceVolume(v) { this.#data.voiceVolume = Math.max(0, Math.min(1, v)); this.save(); }

  getEffectVolume() { return this.#data.effectVolume; }
  setEffectVolume(v) { this.#data.effectVolume = Math.max(0, Math.min(1, v)); this.save(); }

  applyTo(audioManager) {
    if (!audioManager) return;
    audioManager.setChannelVolume('music', this.#data.musicVolume);
    audioManager.setChannelVolume('story', this.#data.voiceVolume);
    audioManager.setChannelVolume('question', this.#data.voiceVolume);
    audioManager.setChannelVolume('choice', this.#data.voiceVolume);
    audioManager.setChannelVolume('effect', this.#data.effectVolume);
    if (this.#data.muted) audioManager.mute();
    else audioManager.unmute();
  }
}
