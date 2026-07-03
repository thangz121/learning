import { AnswerCode } from '../constants/AnswerCode.js';

/**
 * AnswerEngine - Đánh giá đáp án.
 */
export class AnswerEngine {
  validate(question, playerAnswer) {
    if (!question || typeof question !== 'object') throw new Error('Question required');
    const expected = question.answer;
    const expectedType = typeof expected;

    if (expectedType === 'string') {
      return this.#validateString(expected, playerAnswer);
    }

    if (expectedType === 'object' && expected !== null) {
      return this.#validateObject(expected, playerAnswer);
    }

    throw new Error('Unsupported answer format');
  }

  #validateString(expected, received) {
    const norm = (s) => s.trim().toLowerCase();
    const correct = norm(expected) === norm(received);
    return {
      correct,
      code: correct ? AnswerCode.CORRECT : AnswerCode.WRONG_ANSWER,
      expected,
      received,
    };
  }

  #validateObject(expected, received) {
    if (!received || typeof received !== 'object') {
      return { correct: false, code: AnswerCode.WRONG_ANSWER, expected, received };
    }
    const eKeys = Object.keys(expected);
    const rKeys = Object.keys(received);
    if (eKeys.length !== rKeys.length) {
      return { correct: false, code: AnswerCode.WRONG_ANSWER, expected, received };
    }
    const norm = (s) => s.trim().toLowerCase();
    for (const k of eKeys) {
      if (!(k in received) || norm(received[k]) !== norm(expected[k])) {
        return { correct: false, code: AnswerCode.WRONG_ANSWER, expected, received };
      }
    }
    return { correct: true, code: AnswerCode.CORRECT, expected, received };
  }
}
