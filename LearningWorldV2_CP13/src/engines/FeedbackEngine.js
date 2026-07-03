import { AnswerCode } from '../constants/AnswerCode.js';

/**
 * FeedbackEngine - Tạo phản hồi từ AnswerResult.
 */
export class FeedbackEngine {
  create(answerResult) {
    if (!answerResult || typeof answerResult !== 'object') {
      throw new Error('AnswerResult required');
    }

    if (answerResult.code === AnswerCode.CORRECT) {
      return {
        status: 'success',
        message: 'Chính xác!',
        nextAction: 'NEXT',
      };
    }

    return {
      status: 'retry',
      message: 'Con thử lại nhé.',
      nextAction: 'RETRY',
    };
  }
}
