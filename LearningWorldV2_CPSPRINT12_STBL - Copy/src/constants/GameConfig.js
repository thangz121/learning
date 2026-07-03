/**
 * Immutable game configuration.
 */
export const GameConfig = Object.freeze({
  appName: 'Learning World',
  version: '2.0.0',
  debug: true,
  rootSelector: '#app',
  startScene: 'splash',
  speechLanguage: 'vi-VN',
  splashDurationMs: 1500,
  dialogueTypingMs: 28,
  toastDurationMs: 2400,
  feedbackDelayMs: 1500,
  maxRetries: 3,
  starsThreshold: { gold: 90, silver: 70, bronze: 50 },
  audio: {
    defaultMusicVolume: 0.7,
    defaultVoiceVolume: 1.0,
    defaultEffectVolume: 0.8,
  },
});
