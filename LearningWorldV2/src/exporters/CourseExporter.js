/**
 * CourseExporter - Export course data from ContentDatabase.
 *
 * CONTRACT:
 *   exportJSON(courseId, db) → object
 *   exportJS(courseId, db) → string (future)
 *   exportZIP(courseId, db) → Blob (future)
 *
 * ContentDatabase only returns Records.
 * Exporter handles serialization format.
 */
export class CourseExporter {
  static exportJSON(courseId, db) {
    const course = db.courseStore.get(courseId);
    if (!course) return null;

    const categories = db.getCourseCategories(courseId);
    const result = {
      ...course.toJSON(),
      categories: categories.map((cat) => ({
        ...cat.toJSON(),
        lessons: db.getCategoryLessons(courseId, cat.id).map((lesson) => ({
          ...lesson.toJSON(),
          questions: db.getLessonQuestions(lesson.id).map((q) => q.toJSON()),
          assets: db.getLessonAssets(lesson.id).map((a) => a.toJSON()),
        })),
      })),
    };
    return result;
  }

  static exportJS(courseId, db) {
    // TODO Sprint 14: Generate JS module string
    const json = this.exportJSON(courseId, db);
    if (!json) return null;
    return `export default ${JSON.stringify(json, null, 2)};`;
  }
}