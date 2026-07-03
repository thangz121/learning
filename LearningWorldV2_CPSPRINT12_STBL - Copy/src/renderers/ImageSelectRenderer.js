import { QuestionRenderer } from './QuestionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { ChoiceHelper } from '../helpers/ChoiceHelper.js';

/**
 * ImageSelectRenderer - Hiển thị câu hỏi dạng chọn hình ảnh.
 */
export class ImageSelectRenderer extends QuestionRenderer {
  #onSelect = null;
  #locked = false;
  #abortController = null;
  #choicesContainer = null;
  #choiceAudioMap = new Map();

  setOnSelect(callback) { this.#onSelect = callback; }

  render(question) {
    super.render(question);
    this.#locked = false;
    this.#clearFeedback();
    this.#choiceAudioMap.clear();
    if (!question) return;
    if (question.image) this.#renderQuestionImage(question.image);
    this.#attachChoices(question.choices);
  }

  retry() {
    this.#locked = false;
    this.#clearFeedback();
    const buttons = this.#choicesContainer?.querySelectorAll('.image-choice-button');
    if (buttons) {
      buttons.forEach((btn) => {
        btn.classList.remove('is-locked', 'is-correct', 'is-wrong', 'is-pressed');
        btn.disabled = false;
      });
    }
  }

  showFeedback(feedback) {
    this.#clearFeedback();
    const root = this.getRoot();
    if (!root) return;
    const buttons = this.#choicesContainer?.querySelectorAll('.image-choice-button');
    if (buttons) {
      buttons.forEach((btn) => {
        btn.classList.add('is-locked');
        if (feedback.status === 'success') btn.classList.add('is-correct');
        else if (feedback.status === 'retry') btn.classList.add('is-wrong');
      });
    }
    const el = DOMHelper.create('div', {
      classes: ['feedback', `feedback-${feedback.status}`],
      text: feedback.message,
    });
    root.appendChild(el);
  }

  clear() {
    this.#detachListeners();
    this.#locked = false;
    this.#clearFeedback();
    this.#choicesContainer = null;
    this.#choiceAudioMap.clear();
    super.clear();
  }

  destroy() {
    this.#detachListeners();
    this.#locked = false;
    this.#clearFeedback();
    this.#onSelect = null;
    this.#choicesContainer = null;
    this.#choiceAudioMap.clear();
    super.destroy();
  }

  #renderQuestionImage(url) {
    const card = this.getRoot()?.querySelector('.question-card');
    if (!card) return;
    const wrap = DOMHelper.create('div', { classes: ['question-image-container'] });
    const img = DOMHelper.create('img', { classes: ['question-image'], attrs: { src: url, alt: 'Question' } });
    img.onerror = () => { img.style.display = 'none'; };
    wrap.appendChild(img);
    const qtext = card.querySelector('.question-text');
    if (qtext && qtext.nextSibling) card.insertBefore(wrap, qtext.nextSibling);
    else card.appendChild(wrap);
  }

  #attachChoices(choices) {
    this.#detachListeners();
    this.#abortController = new AbortController();
    this.#choicesContainer = DOMHelper.create('div', { classes: ['image-select-choices'] });
    for (const choice of choices) {
      const btn = this.#createChoiceButton(choice);
      this.#choicesContainer.appendChild(btn);
    }
    const card = this.getRoot()?.querySelector('.question-card');
    if (card) card.appendChild(this.#choicesContainer);
    else this.getRoot()?.appendChild(this.#choicesContainer);
  }

  #createChoiceButton(choice) {
    const btn = DOMHelper.create('button', { classes: ['image-choice-button'] });
    btn.type = 'button';
    const imgUrl = ChoiceHelper.getImage(choice);
    if (imgUrl) {
      const img = DOMHelper.create('img', { classes: ['choice-image'], attrs: { src: imgUrl, alt: '' } });
      img.onerror = () => { img.style.display = 'none'; };
      btn.appendChild(img);
    }
    const text = DOMHelper.create('span', { classes: ['choice-text'], text: ChoiceHelper.getText(choice) });
    btn.appendChild(text);
    const value = ChoiceHelper.getValue(choice);
    const audioPath = ChoiceHelper.getAudio(choice);
    if (audioPath) this.#choiceAudioMap.set(value, audioPath);
    btn.addEventListener('click', () => this.#handleClick(value, btn), { signal: this.#abortController?.signal });
    return btn;
  }

  #handleClick(value, btn) {
    if (this.#locked) return;
    const audioPath = this.#choiceAudioMap.get(value);
    if (audioPath) {
      const ae = this.getAudioEngine?.();
      if (ae) ae.playChoice(audioPath);
    }
    this.#locked = true;
    btn.classList.add('is-pressed');
    this.#onSelect?.(value);
  }

  #clearFeedback() {
    const buttons = this.#choicesContainer?.querySelectorAll('.image-choice-button');
    if (buttons) buttons.forEach((b) => b.classList.remove('is-correct', 'is-wrong', 'is-locked', 'is-pressed'));
    const fb = this.getRoot()?.querySelector('.feedback');
    if (fb && fb.parentNode) fb.parentNode.removeChild(fb);
  }

  #detachListeners() {
    if (this.#abortController) { this.#abortController.abort(); this.#abortController = null; }
  }
}
