/**
 * ScrollSystem - Centralized scroll management.
 *
 * CONTRACT:
 *   enable(element)     — enable scroll on element
 *   disable(element)    — disable scroll on element
 *   reset(element)      — reset to top
 *   remember(element)   — save current scroll position
 *   restore(element)    — restore saved scroll position
 *   lockBody()          — prevent body scroll (for modal/overlay)
 *   unlockBody()        — restore body scroll
 *
 * Uses CSS classes, not inline styles.
 */
export class ScrollSystem {
  static #positions = new Map();

  static enable(element) {
    if (!element) return;
    element.classList.add('scroll-enabled');
    element.classList.remove('scroll-disabled');
  }

  static disable(element) {
    if (!element) return;
    element.classList.add('scroll-disabled');
    element.classList.remove('scroll-enabled');
  }

  static reset(element) {
    if (!element) return;
    element.scrollTop = 0;
  }

  static remember(element) {
    if (!element) return;
    this.#positions.set(element, element.scrollTop);
  }

  static restore(element) {
    if (!element) return;
    const pos = this.#positions.get(element);
    if (pos !== undefined) {
      element.scrollTop = pos;
    }
  }

  static lockBody() {
    if (typeof document !== 'undefined') {
      document.body.classList.add('scroll-locked');
    }
  }

  static unlockBody() {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('scroll-locked');
    }
  }

  static isEnabled(element) {
    return element?.classList.contains('scroll-enabled') || false;
  }
}