import { BaseRecord } from './BaseRecord.js';

/**
 * QuestionRecord - Represents a question in a lesson.
 */
export class QuestionRecord extends BaseRecord {
  #lessonId = '';
  #type = '';
  #renderer = '';
  #text = '';
  #image = '';
  #audio = '';
  #story = '';
  #storyAudio = '';
  #choices = [];
  #answer = null;
  #metadata = {};
  #tags = [];

  constructor(data = {}) {
    super(data);
    this.#lessonId = data.lessonId || '';
    this.#type = data.type || '';
    this.#renderer = data.renderer || '';
    this.#text = data.text || '';
    this.#image = data.image || '';
    this.#audio = data.audio || '';
    this.#story = data.story || '';
    this.#storyAudio = data.storyAudio || '';
    this.#choices = Array.isArray(data.choices) ? data.choices : [];
    this.#answer = data.answer !== undefined ? data.answer : null;
    this.#metadata = data.metadata || {};
    this.#tags = Array.isArray(data.tags) ? data.tags : [];
  }

  get lessonId() { return this.#lessonId; }
  get type() { return this.#type; }
  get renderer() { return this.#renderer; }
  get text() { return this.#text; }
  get image() { return this.#image; }
  get audio() { return this.#audio; }
  get story() { return this.#story; }
  get storyAudio() { return this.#storyAudio; }
  get choices() { return [...this.#choices]; }
  get answer() { return this.#answer; }
  get metadata() { return { ...this.#metadata }; }
  get tags() { return [...this.#tags]; }

  // Domain Behavior
  isChoiceQuestion() {
    return this.#type === 'select' || this.#type === 'image-select';
  }

  isDragQuestion() {
    return this.#type === 'drag' || this.#type === 'match' || this.#type === 'order' || this.#type === 'categorize';
  }

  isAudioQuestion() {
    return !!this.#audio || !!this.#storyAudio;
  }

  hasStory() {
    return !!this.#story || !!this.#storyAudio;
  }

  hasImage() {
    return !!this.#image;
  }

  validate() {
    const base = super.validate();
    if (!this.#lessonId) base.errors.push('lessonId is required');
    if (!this.#type) base.errors.push('type is required');
    if (!this.#renderer) base.errors.push('renderer is required');
    if (!this.#text) base.errors.push('text is required');
    if (this.#choices.length === 0) base.errors.push('choices must not be empty');
    if (this.#answer === null) base.errors.push('answer is required');
    if (!this.#image) base.warnings.push('question has no image');
    if (!this.#audio) base.warnings.push('question has no audio');
    if (!this.#story) base.warnings.push('question has no story');
    return { valid: base.errors.length === 0, errors: base.errors, warnings: base.warnings };
  }

  clone() {
    return new QuestionRecord(this.toJSON());
  }

  static deserialize(input) {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    return new QuestionRecord(data);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      lessonId: this.#lessonId,
      type: this.#type,
      renderer: this.#renderer,
      text: this.#text,
      image: this.#image,
      audio: this.#audio,
      story: this.#story,
      storyAudio: this.#storyAudio,
      choices: [...this.#choices],
      answer: this.#answer,
      metadata: { ...this.#metadata },
      tags: [...this.#tags],
    };
  }
}