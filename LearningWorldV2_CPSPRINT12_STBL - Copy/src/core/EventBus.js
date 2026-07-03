/**
 * EventBus - Typed event dispatcher.
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, listener) {
    const bucket = this.listeners.get(eventName) ?? new Set();
    bucket.add(listener);
    this.listeners.set(eventName, bucket);
    return () => this.off(eventName, listener);
  }

  off(eventName, listener) {
    const bucket = this.listeners.get(eventName);
    if (!bucket) return;
    bucket.delete(listener);
    if (bucket.size === 0) this.listeners.delete(eventName);
  }

  emit(eventName, payload) {
    const bucket = this.listeners.get(eventName);
    if (!bucket) return;
    bucket.forEach((l) => l(payload));
  }

  once(eventName, listener) {
    const wrapper = (p) => { this.off(eventName, wrapper); listener(p); };
    this.on(eventName, wrapper);
  }

  clear() { this.listeners.clear(); }
}
