import { EventBus } from './EventBus.js';

/**
 * SceneManager - Duy nhất nơi chuyển Scene.
 *
 * NAVIGATION CONTRACT:
 *   go(name, data)     — navigate to scene, push to history
 *   back()             — navigate to previous scene in history
 *   reload(data)       — recreate current scene with new data, no history change
 *
 * HISTORY CONTRACT:
 *   - go() pushes { name, data } to history stack
 *   - back() pops current, navigates to previous, does NOT push
 *   - reload() does not modify history
 *   - History is linear (no forward navigation yet)
 *
 * LIFECYCLE CONTRACT:
 *   - go(): exit current → destroy current → new instance → enter → mount
 *   - back(): same as go() but with history management
 *   - reload(): exit current → destroy current → new instance (same class) → enter → mount
 */
export class SceneManager {
  #root = null;
  #context = null;
  #scenes = new Map();
  #currentScene = null;
  #history = [];
  #events = null;
  #isNavigatingBack = false;

  constructor(root, context) {
    this.#root = root;
    this.#context = context;
    this.#events = new EventBus();
  }

  register(name, SceneClass) { this.#scenes.set(name, SceneClass); }

  async go(name, data) {
    const SC = this.#scenes.get(name);
    if (!SC) { throw new Error(`Scene "${name}" not registered`); }
    this.#events.emit('scene:before-change', { name });
    if (this.#currentScene) {
      await this.#currentScene.exit();
      this.#currentScene.destroy();
      this.#currentScene = null;
    }
    this.#clearRoot();
    const newScene = new SC(this.#context, data);
    this.#currentScene = newScene;
    await this.#currentScene.enter(data);
    this.#root.appendChild(this.#currentScene.mount());
    if (!this.#isNavigatingBack) {
      this.#history.push({ name, data });
    } else {
      this.#isNavigatingBack = false;
    }
    this.#events.emit('scene:changed', { name });
  }

  async back() {
    if (this.#history.length <= 1) {
      throw new Error('No previous scene to navigate back to');
    }
    this.#history.pop();
    const previous = this.#history[this.#history.length - 1];
    this.#isNavigatingBack = true;
    await this.go(previous.name, previous.data);
  }

  async reload(data) {
    if (!this.#currentScene) return;
    const SC = this.#currentScene.constructor;
    await this.#currentScene.exit();
    this.#currentScene.destroy();
    this.#currentScene = null;
    this.#clearRoot();
    const newScene = new SC(this.#context, data);
    this.#currentScene = newScene;
    await this.#currentScene.enter(data);
    this.#root.appendChild(this.#currentScene.mount());
  }

  current() { return this.#currentScene; }

  get events() { return this.#events; }

  #clearRoot() { while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild); }
}