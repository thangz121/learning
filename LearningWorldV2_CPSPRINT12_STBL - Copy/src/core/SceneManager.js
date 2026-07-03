import { EventBus } from './EventBus.js';

/**
 * SceneManager - Duy nhất nơi chuyển Scene.
 */
export class SceneManager {
  constructor(root, context) {
    this.root = root;
    this.context = context;
    this.scenes = new Map();
    this.currentScene = null;
    this.events = new EventBus();
  }

  register(name, SceneClass) { this.scenes.set(name, SceneClass); }

  async go(name, data) {
    const SC = this.scenes.get(name);
    if (!SC) { console.error('Scene chưa đăng ký:', name); return; }
    this.events.emit('scene:before-change', { name });
    if (this.currentScene) { await this.currentScene.exit(); this.currentScene.destroy(); }
    this.#clearRoot();
    this.currentScene = new SC(this.context, data);
    await this.currentScene.enter(data);
    this.root.appendChild(this.currentScene.mount());
    this.events.emit('scene:changed', { name });
  }

  back() {}

  reload() {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.currentScene.enter();
      this.root.appendChild(this.currentScene.mount());
    }
  }

  current() { return this.currentScene; }

  #clearRoot() { while (this.root.firstChild) this.root.removeChild(this.root.firstChild); }
}
