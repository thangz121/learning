/**
 * CourseProvider - Interface for discovering available courses.
 *
 * CONTRACT:
 *   getCourseIds() — returns Promise<string[]> of course IDs
 *
 * IMPLEMENTATIONS:
 *   FileSystemCourseProvider — reads from data/courses/index.json
 *   ContentDatabaseCourseProvider — reads from ContentDatabase (future)
 */
export class CourseProvider {
  async getCourseIds() {
    throw new Error('CourseProvider.getCourseIds() must be implemented');
  }
}