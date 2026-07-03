import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Scene - Base class for all scenes.
 *
 * LIFECYCLE CONTRACT:
 *   beforeEnter* → enter* → afterEnter* → beforeMount → mount → afterMount
 *   → beforeExit* → exit* → afterExit*
 *   → beforeDestroy → destroy → afterDestroy
 *
 * SYNC hooks (no async): beforeMount, afterMount, beforeDestroy, afterDestroy
 * ASYNC hooks (may await): beforeEnter, afterEnter, beforeExit, afterExit
 *
 * destroy() is SYNC — cleanup must happen immediately, no race condition.
 * afterDestroy may access context but should not retain references.
 *
 * COMPONENT CONTRACT:
 *   addComponent(c)    — register component for lifecycle management
 *   removeComponent(c) — unregister and destroy component
 *   clearComponents()  — destroy all registered components
 *   findComponent(fn)  — find component by predicate
 *   hasComponent(c)    — check if component is registered
 *   getComponents()    — get shallow copy of component list
 */
export class Scene {
  #context = null;
  #data = null;
  #element = null;
  #components = [];
  #destroyed = false;
  #entered = false;
  #mounted = false;

  constructor(context, data) {
    this.#context = context;
    this.#data = data;
  }

  get context() { return this.#context; }
  get data() { return this.#data; }

  async enter(data) {
    if (this.#destroyed) {
      throw new Error('Cannot enter a destroyed scene');
    }
    this.#data = data || this.#data;
    await this.beforeEnter(this.#data);
    this.#element = DOMHelper.create('div', { classes: ['scene'] });
    this.#entered = true;
    this.#mounted = false;
    await this.afterEnter(this.#data);
  }

  async beforeEnter(data) {
    // Override in subclass
    void data;
  }

  async afterEnter(data) {
    // Override in subclass
    void data;
  }

  mount() {
    if (this.#destroyed) {
      throw new Error('Cannot mount a destroyed scene');
    }
    if (this.#mounted) {
      return this.#element;
    }
    this.beforeMount();
    this.#mounted = true;
    this.afterMount();
    return this.#element;
  }

  beforeMount() {
    // Override in subclass — SYNC only
  }

  afterMount() {
    // Override in subclass — SYNC only
  }

  async beforeExit() {
    // Override in subclass
  }

  async exit() {
    if (!this.#entered) return;
    await this.beforeExit();
    this.#entered = false;
    await this.afterExit();
  }

  async afterExit() {
    // Override in subclass
  }

  beforeDestroy() {
    // Override in subclass — SYNC only
  }

  destroy() {
    if (this.#destroyed) return;
    this.beforeDestroy();
    this.#destroyed = true;
    this.#entered = false;
    this.#mounted = false;
    this.clearComponents();
    if (this.#element) {
      if (this.#element.parentNode) {
        this.#element.parentNode.removeChild(this.#element);
      }
      this.#element.innerHTML = '';
      this.#element = null;
    }
    this.afterDestroy();
    this.#data = null;
    this.#context = null;
  }

  afterDestroy() {
    // Override in subclass — SYNC only
    // May access context but should not retain references.
  }

  addComponent(component) {
    if (!component) return;
    this.#components.push(component);
  }

  removeComponent(component) {
    const idx = this.#components.indexOf(component);
    if (idx !== -1) {
      const c = this.#components[idx];
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
      this.#components.splice(idx, 1);
    }
  }

  clearComponents() {
    for (const c of this.#components) {
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
    }
    this.#components = [];
  }

  findComponent(predicate) {
    return this.#components.find(predicate);
  }

  hasComponent(component) {
    return this.#components.includes(component);
  }

  getComponents() {
    return [...this.#components];
  }

  isDestroyed() {
    return this.#destroyed;
  }

  isMounted() {
    return this.#mounted;
  }

  isEntered() {
    return this.#entered;
  }

  get element() {
    return this.#element;
  }
}