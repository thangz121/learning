/**
 * Lesson 010 - Order Gameplay
 */
export default [
  {
    id: 'q010-001',
    course: 'vietnamese',
    lesson: 'number',
    type: 'number',
    renderer: 'order',
    difficulty: 1,
    story: 'Gấu Trúc đếm số.',
    question: 'Sắp xếp các số theo thứ tự từ nhỏ đến lớn!',
    choices: [
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
    ],
    zones: [
      { value: 'pos-1', text: 'Thứ nhất' },
      { value: 'pos-2', text: 'Thứ hai' },
      { value: 'pos-3', text: 'Thứ ba' },
    ],
    answer: {
      '1': 'pos-1',
      '2': 'pos-2',
      '3': 'pos-3',
    },
    schemaVersion: 1,
  },
  {
    id: 'q010-002',
    course: 'vietnamese',
    lesson: 'number',
    type: 'number',
    renderer: 'order',
    difficulty: 2,
    story: 'Gấu Trúc học thứ tự trong tuần.',
    question: 'Sắp xếp các ngày trong tuần đúng thứ tự!',
    choices: [
      { value: 'mon', text: 'Thứ Hai' },
      { value: 'tue', text: 'Thứ Ba' },
      { value: 'wed', text: 'Thứ Tư' },
      { value: 'thu', text: 'Thứ Năm' },
    ],
    zones: [
      { value: 'day-1', text: 'Ngày 1' },
      { value: 'day-2', text: 'Ngày 2' },
      { value: 'day-3', text: 'Ngày 3' },
      { value: 'day-4', text: 'Ngày 4' },
    ],
    answer: {
      mon: 'day-1',
      tue: 'day-2',
      wed: 'day-3',
      thu: 'day-4',
    },
    schemaVersion: 1,
  },
];
