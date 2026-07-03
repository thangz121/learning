import { SplashScene } from '../scenes/SplashScene.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { CourseSelectScene } from '../scenes/CourseSelectScene.js';
import { LessonSelectScene } from '../scenes/LessonSelectScene.js';
import { GameplayScene } from '../scenes/GameplayScene.js';
import { ResultScene } from '../scenes/ResultScene.js';

/**
 * SceneRegistry - Đăng ký tất cả Scene.
 */
export function registerScenes(sceneManager) {
  sceneManager.register('splash', SplashScene);
  sceneManager.register('main-menu', MainMenuScene);
  sceneManager.register('course-select', CourseSelectScene);
  sceneManager.register('lesson-select', LessonSelectScene);
  sceneManager.register('gameplay', GameplayScene);
  sceneManager.register('result', ResultScene);
}
