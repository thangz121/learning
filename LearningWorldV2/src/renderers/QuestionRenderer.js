import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * QuestionRenderer - Abstract base. Tất cả renderer kế thừa.
 */
export class QuestionRenderer {
  #container = null;
  #root = null;
  #mounted = false;
  #destroyed = false;
  #currentQuestion = null;
  #currentIndex = 0;
  #total = 0;
  #audioEngine = null;

  mount(container) {
    if (!container) throw new Error('Container required');
    if (this.#mounted) return;
    this.#container = container;
    this.#root = DOMHelper.create('div', { classes: ['question-renderer'] });
    this.#container.appendChild(this.#root);
    this.#mounted = true;
    this.#destroyed = false;
  }

  render(question) {
    if (this.#destroyed) throw new Error('Cannot render after destroy');
    if (!this.#mounted) throw new Error('Must mount first');
    if (!question) { this.clear(); return; }
    this.#currentQuestion = question;
    this.buildSkeleton(question);
  }

  showFeedback(feedback) {
    // Override in subclass
    void feedback;
  }

  retry() {
    // Override in subclass
    throw new Error('retry() must be implemented by subclass');
  }

  clear() {
    DOMHelper.clear(this.#root);
  }

  destroy() {
    if (this.#destroyed) return;
    this.clear();
    if (this.#root && this.#root.parentNode) this.#root.parentNode.removeChild(this.#root);
    this.#root = null;
    this.#container = null;
    this.#mounted = false;
    this.#destroyed = true;
  }

  isMounted() { return this.#mounted; }
  getRoot() { return this.#root; }
  getQuestion() { return this.#currentQuestion; }

  setAudioEngine(engine) { this.#audioEngine = engine; }
  getAudioEngine() { return this.#audioEngine; }

  setProgress(current, total) {
    this.#currentIndex = current;
    this.#total = total;
    this.#updateProgressBar();
  }

  buildSkeleton(question) {
    this.clear();
    this.#root.appendChild(this.#createProgressBar());
    const card = DOMHelper.create('div', { classes: ['question-card'] });
    if (question.story) card.appendChild(this.#createStory(question.story));
    card.appendChild(this.#createQuestionText(question.question));
    if (question.image) {
      const wrap = DOMHelper.create('div', { classes: ['question-image-container'] });
      const img = DOMHelper.create('img', { classes: ['question-image'], attrs: { src: question.image, alt: '' } });
      img.onerror = () => { img.style.display = 'none'; };
      wrap.appendChild(img);
      card.appendChild(wrap);
    }
    if (question.audio || question.storyAudio) {
      card.appendChild(this.#createReplayButton(question));
    }
    this.#root.appendChild(card);
  }

  setOnSelect(callback) {
    throw new Error('setOnSelect must be implemented by subclass');
  }

  #createProgressBar() {
    const wrap = DOMHelper.create('div', { classes: ['progress-bar-wrap'] });
    const track = DOMHelper.create('div', { classes: ['progress-track'] });
    const fill = DOMHelper.create('div', { classes: ['progress-fill'] });
    fill.style.width = `${this.#getProgressPercent()}%`;
    track.appendChild(fill);
    wrap.appendChild(track);
    wrap.appendChild(DOMHelper.create('div', {
      classes: ['progress-text'],
      text: `Câu ${this.#currentIndex + 1} / ${this.#total || '?'}`,
    }));
    return wrap;
  }

  #updateProgressBar() {
    const fill = this.#root?.querySelector('.progress-fill');
    const text = this.#root?.querySelector('.progress-text');
    if (fill) fill.style.width = `${this.#getProgressPercent()}%`;
    if (text) text.textContent = `Câu ${this.#currentIndex + 1} / ${this.#total || '?'}`;
  }

  #getProgressPercent() {
    if (this.#total <= 1) return 100;
    if (this.#total === 0) return 0;
    return Math.round((this.#currentIndex / (this.#total - 1)) * 100);
  }

  #createStory(text) {
    return DOMHelper.create('div', { classes: ['question-story'], text });
  }

  #createQuestionText(text) {
    return DOMHelper.create('div', { classes: ['question-text'], text });
  }

  #createReplayButton(question) {
    const btn = DOMHelper.create('button', { classes: ['replay-button'], text: '🔊 Nghe lại' });
    btn.type = 'button';
    btn.addEventListener('click', () => {
      if (question.storyAudio) this.#audioEngine?.playStory(question.storyAudio);
      if (question.audio) this.#audioEngine?.playQuestion(question.audio);
    });
    return btn;
  }
}
