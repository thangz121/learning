/**
 * AudioManager - Quản lý phát âm thanh.
 */
export class AudioManager {
  #channels = new Map();
  #muted = false;
  #volume = 1.0;
  #channelVolumes = new Map();

  play(path, options = {}) {
    if (this.#muted || !path) return;
    const channel = options.channel || 'default';
    this.stop(channel);
    const audio = new Audio(path);
    const channelVol = this.#channelVolumes.get(channel) ?? 1.0;
    audio.volume = this.#volume * channelVol;
    this.#channels.set(channel, audio);
    audio.play().catch(() => {});
  }

  stop(channel) {
    const audio = this.#channels.get(channel);
    if (audio) { audio.pause(); audio.currentTime = 0; }
  }

  stopAll() {
    this.#channels.forEach((a) => { a.pause(); a.currentTime = 0; });
    this.#channels.clear();
  }

  mute() { this.#muted = true; this.stopAll(); }
  unmute() { this.#muted = false; }
  isMuted() { return this.#muted; }

  setVolume(v) { this.#volume = Math.max(0, Math.min(1, v)); }
  getVolume() { return this.#volume; }

  setChannelVolume(channel, v) {
    this.#channelVolumes.set(channel, Math.max(0, Math.min(1, v)));
    const audio = this.#channels.get(channel);
    if (audio) audio.volume = this.#volume * Math.max(0, Math.min(1, v));
  }

  getChannelVolume(channel) { return this.#channelVolumes.get(channel) ?? 1.0; }

  dispose() { this.stopAll(); this.#channelVolumes.clear(); }
}
