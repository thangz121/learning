/**
 * @typedef {Object} Choice
 * @property {string} value
 * @property {string} text
 * @property {string} [image]
 * @property {string} [audio]
 * @property {boolean} [disabled]
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} Zone
 * @property {string} value
 * @property {string} [text]
 * @property {string} [image]
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} course
 * @property {string} lesson
 * @property {string} type
 * @property {string} renderer
 * @property {number} difficulty
 * @property {string} story
 * @property {string} question
 * @property {Choice[]} choices
 * @property {string | Record<string,string>} answer
 * @property {string} [image]
 * @property {string} [audio]
 * @property {string} [storyAudio]
 * @property {string} [hint]
 * @property {Zone[]} [zones]
 * @property {number} schemaVersion
 */

/**
 * Validates a single question.
 */
export class QuestionSchema {
  static REQUIRED = ['id','course','lesson','type','renderer','difficulty','story','question','choices','answer'];

  static validate(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Question must be an object');
    const q = raw;

    for (const f of QuestionSchema.REQUIRED) {
      if (!(f in q)) throw new Error(`Missing required field: ${f}`);
    }

    if (typeof q.id !== 'string' || !q.id.trim()) throw new Error('id must be non-empty string');
    if (typeof q.renderer !== 'string' || !q.renderer.trim()) throw new Error('renderer must be non-empty string');
    if (typeof q.question !== 'string' || !q.question.trim()) throw new Error('question must be non-empty string');
    if (!Array.isArray(q.choices) || q.choices.length < 2) throw new Error('choices must be array with >= 2 items');

    for (let i = 0; i < q.choices.length; i++) {
      const c = q.choices[i];
      if (!c || typeof c !== 'object') throw new Error(`choices[${i}] must be object`);
      if (typeof c.value !== 'string' || !c.value.trim()) throw new Error(`choices[${i}].value must be non-empty string`);
      if (typeof c.text !== 'string' || !c.text.trim()) throw new Error(`choices[${i}].text must be non-empty string`);
    }

    const ansType = typeof q.answer;
    if (ansType !== 'string' && ansType !== 'object') throw new Error('answer must be string or object');

    if (ansType === 'string') {
      const vals = q.choices.map((c) => c.value);
      if (!vals.includes(q.answer)) throw new Error(`answer "${q.answer}" not in choices`);
    }

    if (q.zones) {
      if (!Array.isArray(q.zones) || q.zones.length === 0) throw new Error('zones must be non-empty array');
      for (let i = 0; i < q.zones.length; i++) {
        const z = q.zones[i];
        if (!z || typeof z !== 'object') throw new Error(`zones[${i}] must be object`);
        if (typeof z.value !== 'string' || !z.value.trim()) throw new Error(`zones[${i}].value must be non-empty string`);
      }
    }

    if (typeof q.difficulty !== 'number') throw new Error('difficulty must be number');

    return q;
  }

  static validateList(list) {
    if (!Array.isArray(list)) throw new Error('Expected array of questions');
    return list.map((item, i) => {
      try { return QuestionSchema.validate(item); }
      catch (e) { throw new Error(`Question[${i}]: ${e.message}`); }
    });
  }
}
