/**
 * Vietnamese Course Manifest
 */
export default {
  id: 'vietnamese',
  name: 'Tiếng Việt',
  description: 'Học tiếng Việt qua trò chơi',
  schemaVersion: 1,
  categories: [
    {
      id: 'alphabet',
      name: 'Chữ cái',
      lessons: [
        { id: 'lesson001', title: 'Chữ cái A-D', difficulty: 1, duration: 5 },
        { id: 'lesson002', title: 'Động vật & Màu sắc', difficulty: 1, duration: 5 },
        { id: 'lesson003', title: 'Số & Hình dạng', difficulty: 1, duration: 5 },
      ]
    },
    {
      id: 'vocabulary',
      name: 'Từ vựng',
      lessons: [
        { id: 'lesson006', title: 'Kéo thả hoa quả', difficulty: 1, duration: 5 },
        { id: 'lesson007', title: 'Động vật & Môi trường', difficulty: 2, duration: 7 },
        { id: 'lesson008', title: 'Kiểm tra tổng hợp', difficulty: 1, duration: 10 },
        { id: 'lesson009', title: 'Ghép cặp', difficulty: 1, duration: 5 },
        { id: 'lesson011', title: 'Phân loại', difficulty: 1, duration: 5 },
      ]
    },
    {
      id: 'number',
      name: 'Số học',
      lessons: [
        { id: 'lesson010', title: 'Sắp xếp số', difficulty: 1, duration: 5 },
      ]
    }
  ]
};
