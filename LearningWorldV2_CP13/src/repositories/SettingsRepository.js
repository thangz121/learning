import { Storage } from '../core/Storage.js';

/**
 * SettingsRepository - Lưu/đọc cài đặt.
 */
export class SettingsRepository {
  constructor() { this.storage = new Storage('lw2_settings'); }

  load(key) { return this.storage.load(key); }
  save(key, value) { return this.storage.save(key, value); }
  remove(key) { this.storage.remove(key); }
}
