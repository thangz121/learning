/**
 * DOMHelper - Safe DOM element creation.
 */
export class DOMHelper {
  static create(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.classes) options.classes.forEach((c) => el.classList.add(c));
    if (options.text !== undefined) el.textContent = options.text;
    if (options.attrs) Object.entries(options.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  static clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }
}
