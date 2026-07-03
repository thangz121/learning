/**
 * ChoiceHelper - Normalize choice objects.
 */
export class ChoiceHelper {
  static getText(choice) {
    if (!choice || typeof choice !== 'object') return '';
    return choice.text || choice.value || '';
  }

  static getValue(choice) {
    if (!choice || typeof choice !== 'object') return '';
    return choice.value || '';
  }

  static getImage(choice) {
    if (typeof choice === 'object' && choice !== null) return choice.image || null;
    return null;
  }

  static getAudio(choice) {
    if (typeof choice === 'object' && choice !== null) return choice.audio || null;
    return null;
  }

  static isObject(choice) {
    return choice !== null && typeof choice === 'object';
  }
}
