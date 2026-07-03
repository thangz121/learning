/**
 * Lesson 009 - Match Gameplay
 */
export default [
  {
    id: 'q009-001',
    course: 'vietnamese',
    lesson: 'vocabulary',
    type: 'vocabulary',
    renderer: 'match',
    difficulty: 1,
    story: 'Gấu Trúc ghép cặp đồ vật.',
    question: 'Kéo đồ vật ghép với hình ảnh đúng!',
    choices: [
      { value: 'dog', text: 'Con chó' },
      { value: 'cat', text: 'Con mèo' },
      { value: 'bird', text: 'Con chim' },
    ],
    zones: [
      { value: 'dog-img', text: '🐶' },
      { value: 'cat-img', text: '🐱' },
      { value: 'bird-img', text: '🐦' },
    ],
    answer: {
      dog: 'dog-img',
      cat: 'cat-img',
      bird: 'bird-img',
    },
    schemaVersion: 1,
  },
  {
    id: 'q009-002',
    course: 'vietnamese',
    lesson: 'vocabulary',
    type: 'alphabet',
    renderer: 'match',
    difficulty: 1,
    story: 'Gấu Trúc ghép chữ cái.',
    question: 'Kéo chữ in hoa ghép với chữ thường!',
    choices: [
      { value: 'A', text: 'A' },
      { value: 'B', text: 'B' },
      { value: 'C', text: 'C' },
    ],
    zones: [
      { value: 'a', text: 'a' },
      { value: 'b', text: 'b' },
      { value: 'c', text: 'c' },
    ],
    answer: {
      A: 'a',
      B: 'b',
      C: 'c',
    },
    schemaVersion: 1,
  },
];
