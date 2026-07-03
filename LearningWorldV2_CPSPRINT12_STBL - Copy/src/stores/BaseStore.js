/**
 * BaseStore - Abstract base for all content stores.
 *
 * CONTRACT:
 *   get(id) → Record | null
 *   getAll() → Record[]
 *   add(record) → void
 *   update(id, changes) → Record
 *   remove(id) → void
 *   clear() → void
 *   find(predicate) → Record[]
 *   exists(id) → boolean
 *   count() → number
 *   isEmpty() → boolean
 *
 * EVENTS (via StudioEventBus):
 *   {storeName}:added, {storeName}:updated, {storeName}:removed, {storeName}:cleared
 */
export class BaseStore {
  #records = new Map();
  #storeName = '';
  #eventBus = null;

  constructor(storeName, eventBus) {
    this.#storeName = storeName;
    this.#eventBus = eventBus;
  }

  get(id) {
    const record = this.#records.get(id);
    return record ? record.clone() : null;
  }

  getAll() {
    return Array.from(this.#records.values()).map((r) => r.clone());
  }

  add(record) {
    if (!record || !record.id) {
      throw new Error('Invalid record: must have id');
    }
    if (this.#records.has(record.id)) {
      throw new Error(`Record ${record.id} already exists`);
    }
    this.#records.set(record.id, record.clone());
    this.#emit('added', { id: record.id });
  }

  update(id, changes) {
    const existing = this.#records.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found`);
    }
    const updated = existing.copyWith(changes);
    this.#records.set(id, updated);
    this.#emit('updated', { id: updated.id });
    return updated.clone();
  }

  remove(id) {
    const existing = this.#records.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found`);
    }
    // TODO Sprint 14: Soft delete instead of hard delete
    this.#records.delete(id);
    this.#emit('removed', { id: existing.id });
  }

  clear() {
    const removedCount = this.#records.size;
    this.#records.clear();
    this.#emit('cleared', { removedCount });
  }

  find(predicate) {
    // TODO Sprint 14: Move complex queries to Query Layer
    return Array.from(this.#records.values()).filter(predicate).map((r) => r.clone());
  }

  exists(id) {
    return this.#records.has(id);
  }

  count() {
    return this.#records.size;
  }

  isEmpty() {
    return this.#records.size === 0;
  }

  #emit(action, payload) {
    if (this.#eventBus) {
      this.#eventBus.emit(`${this.#storeName}:${action}`, {
        ...payload,
        store: this.#storeName,
        action,
        timestamp: Date.now(),
      });
    }
  }
}