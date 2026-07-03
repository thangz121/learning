/**
 * Storage - localStorage wrapper with namespace.
 */
export class Storage {
  constructor(ns = 'lw2') { this.ns = ns; }
  #k(k) { return `${this.ns}:${k}`; }

  load(k) {
    try { const r = localStorage.getItem(this.#k(k)); return r ? JSON.parse(r) : null; }
    catch { return null; }
  }

  save(k, v) {
    try { localStorage.setItem(this.#k(k), JSON.stringify(v)); return true; }
    catch { return false; }
  }

  remove(k) { localStorage.removeItem(this.#k(k)); }

  clear() {
    const p = this.ns + ':';
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(p)) localStorage.removeItem(k);
    }
  }
}
