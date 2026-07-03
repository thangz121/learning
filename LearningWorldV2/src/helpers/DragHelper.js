import { PointerHelper } from './PointerHelper.js';

/**
 * DragHelper - Reusable drag interaction.
 */
export class DragHelper {
  #container;
  #pointer = null;
  #state = { dragging: false, el: null, value: null };
  #onDragStart = null;
  #onDragMove = null;
  #onDragEnd = null;
  #draggableSel;
  #dropTargetSel;

  constructor(container, opts = {}) {
    if (!container || !(container instanceof HTMLElement)) throw new Error('DragHelper requires HTMLElement');
    this.#container = container;
    this.#draggableSel = opts.draggableSelector || '[data-draggable]';
    this.#dropTargetSel = opts.dropTargetSelector || '[data-drop-target]';
  }

  onDragStart(cb) { this.#onDragStart = cb; }
  onDragMove(cb) { this.#onDragMove = cb; }
  onDragEnd(cb) { this.#onDragEnd = cb; }

  attach() {
    if (this.#pointer) return;
    this.#pointer = new PointerHelper(this.#container);
    this.#pointer.onStart((pos, e) => this.#handleStart(pos, e));
    this.#pointer.onMove((pos, e) => this.#handleMove(pos, e));
    this.#pointer.onEnd((pos, e) => this.#handleEnd(pos, e));
    this.#pointer.attach();
  }

  detach() {
    if (this.#pointer) { this.#pointer.detach(); this.#pointer = null; }
    this.#reset();
  }

  #handleStart(pos, e) {
    const target = e.target;
    if (!target) return;
    const draggable = target.closest(this.#draggableSel);
    if (!draggable) return;
    const value = draggable.getAttribute('data-value');
    if (!value) return;
    this.#state = { dragging: true, el: draggable, value };
    this.#onDragStart?.(value, draggable, pos);
  }

  #handleMove(pos, e) {
    if (!this.#state.dragging) return;
    this.#onDragMove?.(this.#state.value, pos);
  }

  #handleEnd(pos, e) {
    if (!this.#state.dragging) return;
    const value = this.#state.value;
    const el = this.#state.el;
    el.style.visibility = 'hidden';
    const targetEl = document.elementFromPoint(pos.x, pos.y);
    el.style.visibility = '';
    const dropTarget = targetEl?.closest(this.#dropTargetSel) || null;
    this.#onDragEnd?.(value, pos, dropTarget);
    this.#reset();
  }

  #reset() { this.#state = { dragging: false, el: null, value: null }; }
}
