/**
 * TimeHelper - Time utilities.
 */
export class TimeHelper {
  static now() { return Date.now(); }
  static delay(ms) { return new Promise((r) => setTimeout(r, ms)); }
}
