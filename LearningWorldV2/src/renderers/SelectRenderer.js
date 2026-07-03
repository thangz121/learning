import { QuestionRenderer } from './QuestionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';
import { ChoiceHelper } from '../helpers/ChoiceHelper.js';

/**
 * SelectRenderer - Hiển thị câu hỏi dạng chọn text.
 */
export class SelectRenderer extends QuestionRenderer {
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
    this.#attachChoices(question.choices);
  }

  retry() {
    this.#locked = false;
    this.#clearFeedback();
    const buttons = this.#choicesContainer?.querySelectorAll('.choice-button');
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
    const buttons = this.#choicesContainer?.querySelectorAll('.choice-button');
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

  #attachChoices(choices) {
    this.#detachListeners();
    this.#abortController = new AbortController();
    this.#choicesContainer = DOMHelper.create('div', { classes: ['select-choices'] });
    for (const choice of choices) {
      const btn = this.#createChoiceButton(choice);
      this.#choicesContainer.appendChild(btn);
    }
    const card = this.getRoot()?.querySelector('.question-card');
    if (card) card.appendChild(this.#choicesContainer);
    else this.getRoot()?.appendChild(this.#choicesContainer);
  }

  #createChoiceButton(choice) {
    const btn = DOMHelper.create('button', {
      classes: ['choice-button'],
      text: ChoiceHelper.getText(choice),
    });
    btn.type = 'button';
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
    const buttons = this.#choicesContainer?.querySelectorAll('.choice-button');
    if (buttons) buttons.forEach((b) => b.classList.remove('is-correct', 'is-wrong', 'is-locked', 'is-pressed'));
    const fb = this.getRoot()?.querySelector('.feedback');
    if (fb && fb.parentNode) fb.parentNode.removeChild(fb);
  }

  #detachListeners() {
    if (this.#abortController) { this.#abortController.abort(); this.#abortController = null; }
  }
}
