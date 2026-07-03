/**
 * Lesson 011 - Categorize Gameplay
 */
export default [
  {
    id: 'q011-001',
    course: 'vietnamese',
    lesson: 'vocabulary',
    type: 'vocabulary',
    renderer: 'categorize',
    difficulty: 1,
    story: 'Gấu Trúc dọn nhà.',
    question: 'Phân loại đồ vật vào đúng nhóm!',
    choices: [
      { value: 'shirt', text: 'Áo' },
      { value: 'apple', text: 'Táo' },
      { value: 'pants', text: 'Quần' },
      { value: 'banana', text: 'Chuối' },
    ],
    zones: [
      { value: 'clothes', text: 'Quần áo' },
      { value: 'food', text: 'Thức ăn' },
    ],
    answer: {
      shirt: 'clothes',
      apple: 'food',
      pants: 'clothes',
      banana: 'food',
    },
    schemaVersion: 1,
  },
  {
    id: 'q011-002',
    course: 'vietnamese',
    lesson: 'vocabulary',
    type: 'vocabulary',
    renderer: 'categorize',
    difficulty: 2,
    story: 'Gấu Trúc học phân loại động vật.',
    question: 'Phân loại động vật theo đặc điểm!',
    choices: [
      { value: 'eagle', text: 'Đại bàng' },
      { value: 'shark', text: 'Cá mập' },
      { value: 'elephant', text: 'Voi' },
      { value: 'parrot', text: 'Vẹt' },
      { value: 'whale', text: 'Cá voi' },
    ],
    zones: [
      { value: 'fly', text: 'Biết bay' },
      { value: 'swim', text: 'Biết bơi' },
      { value: 'walk', text: 'Biết đi' },
    ],
    answer: {
      eagle: 'fly',
      shark: 'swim',
      elephant: 'walk',
      parrot: 'fly',
      whale: 'swim',
    },
    schemaVersion: 1,
  },
];
