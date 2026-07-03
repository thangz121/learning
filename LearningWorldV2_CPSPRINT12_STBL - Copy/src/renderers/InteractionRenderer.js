import { QuestionRenderer } from './QuestionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { ChoiceHelper } from '../helpers/ChoiceHelper.js';
import { DragHelper } from '../helpers/DragHelper.js';

/**
 * InteractionRenderer - Base cho drag-based renderers.
 * Extracts common drag logic.
 */
export class InteractionRenderer extends QuestionRenderer {
  #onSelect = null;
  #locked = false;
  #dragHelper = null;
  #placements = {};
  #choicesContainer = null;

  setOnSelect(callback) { this.#onSelect = callback; }

  render(question) {
    super.render(question);
    this.#locked = false;
    this.#clearFeedback();
    this.#placements = {};
    this.#choicesContainer = null;
    if (!question) return;
    this.buildInteractionLayout(question);
    this.#attachDragBehavior();
  }

  retry() {
    this.#locked = false;
    this.#clearFeedback();
    this.#placements = {};
    const root = this.getRoot();
    if (root && this.#choicesContainer) {
      const draggables = root.querySelectorAll('[data-draggable]');
      draggables.forEach((el) => {
        el.classList.remove('dropped', 'matched', 'placed', 'categorized', 'dragging');
        this.#choicesContainer.appendChild(el);
      });
    }
    this.#detachDrag();
    this.#attachDragBehavior();
  }

  showFeedback(feedback) {
    this.#clearFeedback();
    const root = this.getRoot();
    if (!root) return;
    const el = DOMHelper.create('div', {
      classes: ['feedback', `feedback-${feedback.status}`],
      text: feedback.message,
    });
    root.appendChild(el);
  }

  clear() {
    this.#detachDrag();
    this.#locked = false;
    this.#clearFeedback();
    this.#placements = {};
    this.#choicesContainer = null;
    super.clear();
  }

  destroy() {
    this.#detachDrag();
    this.#locked = false;
    this.#clearFeedback();
    this.#onSelect = null;
    this.#placements = {};
    this.#choicesContainer = null;
    super.destroy();
  }

  buildInteractionLayout(question) {
    // Override in subclass
    void question;
  }

  #attachDragBehavior() {
    const root = this.getRoot();
    if (!root) return;
    this.#detachDrag();
    this.#dragHelper = new DragHelper(root, {
      draggableSelector: '[data-draggable]',
      dropTargetSelector: '[data-drop-target]',
    });
    this.#dragHelper.onDragStart((value, el) => {
      el.classList.add('dragging');
    });
    this.#dragHelper.onDragEnd((value, pos, targetEl) => {
      const dragged = root.querySelector(`[data-value="${value}"][data-draggable]`);
      if (dragged) dragged.classList.remove('dragging');
      if (targetEl) this.#handleDrop(value, targetEl);
    });
    this.#dragHelper.attach();
  }

  #handleDrop(value, targetEl) {
    if (this.#locked) return;
    const zoneValue = targetEl.getAttribute('data-value');
    if (!zoneValue) return;
    this.#placements[value] = zoneValue;
    this.onItemDropped(value, targetEl);
    const total = this.getTotalDraggableCount();
    const placed = Object.keys(this.#placements).length;
    if (placed >= total && this.#onSelect) {
      this.#locked = true;
      this.#onSelect({ ...this.#placements });
    }
  }

  getTotalDraggableCount() {
    return this.getRoot()?.querySelectorAll('[data-draggable]').length || 0;
  }

  onItemDropped(value, targetEl) {
    // Override in subclass for visual update
    void value; void targetEl;
  }

  createDraggable(choice, className) {
    const el = DOMHelper.create('div', { classes: [className] });
    el.setAttribute('data-draggable', 'true');
    el.setAttribute('data-value', ChoiceHelper.getValue(choice));
    const imgUrl = ChoiceHelper.getImage(choice);
    if (imgUrl) {
      const img = DOMHelper.create('img', { classes: [`${className}-image`], attrs: { src: imgUrl, alt: '' } });
      el.appendChild(img);
    }
    el.appendChild(DOMHelper.create('span', { classes: [`${className}-text`], text: ChoiceHelper.getText(choice) }));
    return el;
  }

  createZone(zone, className, areaClass) {
    const el = DOMHelper.create('div', { classes: [className] });
    el.setAttribute('data-drop-target', 'true');
    el.setAttribute('data-value', zone.value);
    if (zone.image) {
      const img = DOMHelper.create('img', { classes: [`${className}-image`], attrs: { src: zone.image, alt: '' } });
      el.appendChild(img);
    }
    el.appendChild(DOMHelper.create('span', { classes: [`${className}-text`], text: zone.text || zone.value }));
    const area = DOMHelper.create('div', { classes: [areaClass] });
    el.appendChild(area);
    return el;
  }

  setChoicesContainer(el) { this.#choicesContainer = el; }

  #detachDrag() {
    if (this.#dragHelper) { this.#dragHelper.detach(); this.#dragHelper = null; }
  }

  #clearFeedback() {
    const fb = this.getRoot()?.querySelector('.feedback');
    if (fb && fb.parentNode) fb.parentNode.removeChild(fb);
  }
}
