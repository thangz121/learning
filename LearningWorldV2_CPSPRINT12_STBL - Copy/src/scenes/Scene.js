import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Scene - Base class. Mọi Scene kế thừa.
 */
export class Scene {
  constructor(context, data) {
    this.context = context;
    this.data = data || {};
    this.components = [];
    this.element = DOMHelper.create('section', {
      classes: ['scene'],
      attrs: { 'aria-label': this.constructor.name }
    });
  }

  async enter(data) {
    // Override in subclass
    void data;
  }

  async exit() {
    // Override in subclass
  }

  mount() {
    return this.element;
  }

  destroy() {
    this.components.forEach((c) => c.destroy?.());
    this.components = [];
    if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
  }

  add(component) {
    this.components.push(component);
    this.element.appendChild(component.mount?.() || component);
    return component;
  }
}
