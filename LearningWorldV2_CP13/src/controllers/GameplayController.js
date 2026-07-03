import { QuestionEngine } from '../engines/QuestionEngine.js';
import { AnswerEngine } from '../engines/AnswerEngine.js';
import { FeedbackEngine } from '../engines/FeedbackEngine.js';
import { ProgressEngine } from '../engines/ProgressEngine.js';
import { AudioEngine } from '../engines/AudioEngine.js';
import { RendererFactory } from '../renderers/RendererFactory.js';

/**
 * GameplayController - Điều phối toàn bộ gameplay.
 * Không render, không đọc file, không điều hướng Scene.
 */
export class GameplayController {
  #context;
  #questionEngine;
  #answerEngine;
  #feedbackEngine;
  #progressEngine;
  #audioEngine;
  #renderer = null;
  #container = null;
  #onComplete = null;
  #session = { correct: 0, wrong: 0, startTime: 0 };
  #timer = null;
  #finished = false;

  constructor(context) {
    this.#context = context;
    this.#questionEngine = new QuestionEngine();
    this.#answerEngine = new AnswerEngine();
    this.#feedbackEngine = new FeedbackEngine();
    this.#progressEngine = new ProgressEngine();
    this.#audioEngine = new AudioEngine();
    this.#audioEngine.initialize(context.audioManager);
  }

  async startLesson({ course, category, lessonId, container, onComplete }) {
    this.#container = container;
    this.#onComplete = onComplete;
    this.#session = { correct: 0, wrong: 0, startTime: Date.now() };
    this.#finished = false;

    const questions = await this.#context.questionRepository.loadLesson(course, category, lessonId);
    this.#questionEngine.load(questions);
    this.#renderCurrent();
  }

  restartLesson() {
    this.#finished = false;
    this.#session = { correct: 0, wrong: 0, startTime: Date.now() };
    this.#questionEngine.reset();
    this.#clearTimer();
    this.#audioEngine.stopAll();
    this.#renderCurrent();
  }

  #renderCurrent() {
    const question = this.#questionEngine.current();
    if (!question) { this.#finish(); return; }

    if (this.#renderer) { this.#renderer.destroy(); this.#renderer = null; }

    this.#audioEngine.stopAll();

    this.#renderer = RendererFactory.create(question.renderer);
    this.#renderer.setOnSelect((choice) => this.#handleAnswer(choice));
    this.#renderer.setAudioEngine(this.#audioEngine);
    this.#renderer.mount(this.#container);
    this.#renderer.setProgress(this.#questionEngine.currentIndex(), this.#questionEngine.count());
    this.#renderer.render(question);

    if (question.storyAudio) this.#audioEngine.playStory(question.storyAudio);
    if (question.audio) this.#audioEngine.playQuestion(question.audio);
  }

  #handleAnswer(choice) {
    if (this.#finished) return;
    const question = this.#questionEngine.current();
    if (!question) return;

    this.#audioEngine.stopChannel('choice');

    const result = this.#answerEngine.validate(question, choice);
    const feedback = this.#feedbackEngine.create(result);

    this.#renderer.showFeedback(feedback);

    if (result.correct) this.#session.correct++;
    else this.#session.wrong++;

    if (feedback.nextAction === 'NEXT') {
      this.#audioEngine.stopAll();
      if (this.#questionEngine.isFinished()) {
        this.#timer = setTimeout(() => this.#finish(), 1500);
      } else {
        this.#timer = setTimeout(() => {
          this.#questionEngine.next();
          this.#renderCurrent();
        }, 1500);
      }
    } else if (feedback.nextAction === 'RETRY') {
      this.#timer = setTimeout(() => {
        this.#renderer.retry();
      }, 1200);
    }
  }

  #finish() {
    if (this.#finished) return;
    this.#finished = true;
    this.#clearTimer();
    this.#audioEngine.stopAll();

    const duration = Date.now() - this.#session.startTime;
    const result = this.#progressEngine.calculate({
      correct: this.#session.correct,
      wrong: this.#session.wrong,
      duration,
      total: this.#questionEngine.count(),
    });

    this.#onComplete?.(result);
  }

  #clearTimer() {
    if (this.#timer) { clearTimeout(this.#timer); this.#timer = null; }
  }

  destroy() {
    this.#clearTimer();
    this.#finished = true;
    if (this.#renderer) { this.#renderer.destroy(); this.#renderer = null; }
    this.#audioEngine.stopAll();
    this.#audioEngine.dispose();
    this.#questionEngine.destroy();
  }
}
