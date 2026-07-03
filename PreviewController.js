import { QuestionEngine } from '../engines/QuestionEngine.js';
import { RendererFactory } from '../renderers/RendererFactory.js';
import { FeedbackEngine } from '../engines/FeedbackEngine.js';

/**
 * PreviewController - Preview lesson using production runtime.
 *
 * CONTRACT:
 *   loadLesson(questions, container) → void
 *   next() → void
 *   previous() → void
 *   replay() → void
 *   getCurrentQuestion() → QuestionRecord
 *   getProgress() → { current, total }
 *   destroy() → void
 *
 * USES:
 *   QuestionEngine, RendererFactory, AudioEngine, FeedbackEngine
 * DOES NOT USE:
 *   ProgressController, ProgressRepository, AnswerEngine (no scoring)
 */
export class PreviewController {
  #questionEngine = null;
  #renderer = null;
  #container = null;
  #audioEngine = null;
  #feedbackEngine = null;
  #currentQuestion = null;
  #questions = [];

  constructor(context) {
    this.#questionEngine = new QuestionEngine();
    this.#audioEngine = context.audioEngine || null;
    this.#feedbackEngine = new FeedbackEngine();
    this.#container = null;
  }

  loadLesson(questions, container) {
    this.#questions = questions || [];
    this.#container = container;
    this.#questionEngine.load(this.#questions);
    this.#renderCurrent();
  }

  next() {
    if (this.#questionEngine.hasNext()) {
      this.#questionEngine.next();
      this.#renderCurrent();
    }
  }

  previous() {
    if (this.#questionEngine.hasPrevious()) {
      this.#questionEngine.previous();
      this.#renderCurrent();
    }
  }

  replay() {
    this.#renderCurrent();
  }

  getCurrentQuestion() {
    return this.#currentQuestion;
  }

  getProgress() {
    return {
      current: this.#questionEngine.getCurrentIndex() + 1,
      total: this.#questionEngine.getTotal(),
    };
  }

  destroy() {
    if (this.#renderer) {
      this.#renderer.destroy();
      this.#renderer = null;
    }
    this.#questionEngine = null;
    this.#audioEngine = null;
    this.#feedbackEngine = null;
    this.#currentQuestion = null;
    this.#questions = [];
    this.#container = null;
  }

  #renderCurrent() {
    if (this.#renderer) {
      this.#renderer.destroy();
      this.#renderer = null;
    }

    this.#currentQuestion = this.#questionEngine.getCurrent();
    if (!this.#currentQuestion || !this.#container) return;

    this.#renderer = RendererFactory.create(this.#currentQuestion.renderer || 'select');
    this.#renderer.setAudioEngine(this.#audioEngine);
    this.#renderer.mount(this.#container);
    this.#renderer.setProgress(
      this.#questionEngine.getCurrentIndex(),
      this.#questionEngine.getTotal()
    );
    this.#renderer.render(this.#currentQuestion);
  }
}