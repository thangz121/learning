import { SelectRenderer } from './SelectRenderer.js';
import { ImageSelectRenderer } from './ImageSelectRenderer.js';
import { DragRenderer } from './DragRenderer.js';
import { MatchRenderer } from './MatchRenderer.js';
import { OrderRenderer } from './OrderRenderer.js';
import { CategorizeRenderer } from './CategorizeRenderer.js';

/**
 * RendererFactory - Tạo renderer theo tên.
 */
export class RendererFactory {
  static #registry = new Map([
    ['select', SelectRenderer],
    ['image-select', ImageSelectRenderer],
    ['drag', DragRenderer],
    ['match', MatchRenderer],
    ['order', OrderRenderer],
    ['categorize', CategorizeRenderer],
  ]);

  static create(name) {
    const C = RendererFactory.#registry.get(name);
    if (C) return new C();
    return new SelectRenderer();
  }

  static register(name, RendererClass) {
    if (RendererFactory.#registry.has(name)) throw new Error(`Renderer "${name}" already registered`);
    RendererFactory.#registry.set(name, RendererClass);
  }

  static list() { return Array.from(RendererFactory.#registry.keys()); }
}
