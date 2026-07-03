import { CourseManager } from './CourseManager.js';
import { LessonManager } from './LessonManager.js';
import { QuestionManager } from './QuestionManager.js';
import { AssetManager } from './AssetManager.js';
import { AudioManager } from './AudioManager.js';
import { ImageManager } from './ImageManager.js';
import { ImportPanel } from './importer/ImportPanel.js';
import { PreviewPanel } from './preview/PreviewPanel.js';
import { DebugPanel } from './debug/DebugPanel.js';
import { SettingsPanel } from './settings/SettingsPanel.js';
import { UnknownPanel } from './UnknownPanel.js';

/**
 * StudioRouter - Creates studio panels on demand via factory Map.
 * Plugins can register new panels without modifying this file.
 */
export class StudioRouter {
  #container = null;
  #context = null;
  #factories = new Map();

  constructor(container, context) {
    this.#container = container;
    this.#context = context;
    this.#registerDefaults();
  }

  register(id, factory) {
    if (this.#factories.has(id)) {
      throw new Error(`Panel "${id}" already registered`);
    }
    this.#factories.set(id, factory);
  }

  unregister(id) {
    this.#factories.delete(id);
  }

  createPanel(panelId) {
    const factory = this.#factories.get(panelId);
    if (!factory) {
      return new UnknownPanel(this.#container, this.#context, panelId, this.listPanels());
    }
    return factory(this.#container, this.#context);
  }

  listPanels() {
    return Array.from(this.#factories.keys());
  }

  #registerDefaults() {
    this.#factories.set('courses', (c, ctx) => new CourseManager(c, ctx));
    this.#factories.set('lessons', (c, ctx) => new LessonManager(c, ctx));
    this.#factories.set('questions', (c, ctx) => new QuestionManager(c, ctx));
    this.#factories.set('assets', (c, ctx) => new AssetManager(c, ctx));
    this.#factories.set('audio', (c, ctx) => new AudioManager(c, ctx));
    this.#factories.set('images', (c, ctx) => new ImageManager(c, ctx));
    this.#factories.set('import', (c, ctx) => new ImportPanel(c, ctx));
    this.#factories.set('preview', (c, ctx) => new PreviewPanel(c, ctx));
    this.#factories.set('debug', (c, ctx) => new DebugPanel(c, ctx));
    this.#factories.set('settings', (c, ctx) => new SettingsPanel(c, ctx));
  }
}