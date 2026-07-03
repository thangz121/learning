/**
 * ProgressController - Quản lý tiến trình người chơi.
 */
export class ProgressController {
  constructor(progressRepository) {
    this.repository = progressRepository;
  }

  save(course, lessonId, data) {
    return this.repository.save(course, lessonId, data);
  }

  load(course, lessonId) {
    return this.repository.load(course, lessonId);
  }

  reset(course, lessonId) {
    this.repository.reset(course, lessonId);
  }
}
