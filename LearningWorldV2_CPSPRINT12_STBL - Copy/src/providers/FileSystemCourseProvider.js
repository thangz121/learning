import { CourseProvider } from './CourseProvider.js';

/**
 * FileSystemCourseProvider - Discovers courses from data/courses/index.json.
 *
 * CONTRACT:
 *   - Reads ../data/courses/index.json via fetch
 *   - Returns empty array on any error (network, parse, missing file)
 *   - Never throws
 */
export class FileSystemCourseProvider extends CourseProvider {
  async getCourseIds() {
    try {
      const response = await fetch('../data/courses/index.json');
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data.courses) ? data.courses : [];
    } catch {
      return [];
    }
  }
}