import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * Dialogue - Panda dialogue box.
 */
export class Dialogue {
  constructor() {
    this.element = DOMHelper.create('div', { classes: ['dialogue'] });
    this.avatar = DOMHelper.create('div', { classes: ['dialogue__avatar'], text: '🐼' });
    this.bubble = DOMHelper.create('div', { classes: ['dialogue__bubble'] });
    this.text = DOMHelper.create('p', { classes: ['dialogue__text'] });
    this.bubble.appendChild(this.text);
    this.element.appendChild(this.avatar);
    this.element.appendChild(this.bubble);
  }

  say(text, speed = 28) {
    this.text.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) { this.text.textContent += text[i]; i++; setTimeout(type, speed); }
    };
    type();
  }

  clear() { this.text.textContent = ''; }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
}
