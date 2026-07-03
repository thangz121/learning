import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * ProgressBar - Reusable progress bar.
 */
export class ProgressBar {
  constructor() {
    this.element = DOMHelper.create('div', { classes: ['progress-bar-wrap'] });
    const track = DOMHelper.create('div', { classes: ['progress-track'] });
    this.fill = DOMHelper.create('div', { classes: ['progress-fill'] });
    track.appendChild(this.fill);
    this.element.appendChild(track);
    this.text = DOMHelper.create('div', { classes: ['progress-text'] });
    this.element.appendChild(this.text);
  }

  setProgress(current, total) {
    const pct = total <= 1 ? 100 : Math.round((current / (total - 1)) * 100);
    this.fill.style.width = `${pct}%`;
    this.text.textContent = `Câu ${current + 1} / ${total || '?'}`;
  }

  mount() { return this.element; }
  destroy() { this.element.remove(); }
}
