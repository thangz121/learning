import { SceneManager } from '../core/SceneManager.js';
import { AudioManager } from '../audio/AudioManager.js';
import { AudioSettings } from '../audio/AudioSettings.js';
import { QuestionRepository } from '../repositories/QuestionRepository.js';
import { LessonRepository } from '../repositories/LessonRepository.js';
import { ProgressRepository } from '../repositories/ProgressRepository.js';
import { SettingsRepository } from '../repositories/SettingsRepository.js';
import { NavigationController } from '../controllers/NavigationController.js';
import { ProgressController } from '../controllers/ProgressController.js';
import { registerScenes } from '../registry/SceneRegistry.js';

/**
 * App - Top-level application coordinator.
 */
export class App {
  constructor(root) {
    this.root = root;
    this.audioManager = new AudioManager();
    this.questionRepository = new QuestionRepository();
    this.lessonRepository = new LessonRepository();
    this.progressRepository = new ProgressRepository();
    this.settingsRepository = new SettingsRepository();

    this.audioSettings = new AudioSettings(this.settingsRepository);
    this.audioSettings.applyTo(this.audioManager);

    this.context = {
      sceneManager: null,
      audioManager: this.audioManager,
      audioSettings: this.audioSettings,
      questionRepository: this.questionRepository,
      lessonRepository: this.lessonRepository,
      progressRepository: this.progressRepository,
      settingsRepository: this.settingsRepository,
    };

    const gameLayer = root.querySelector('#game-layer');
    this.context.sceneManager = new SceneManager(gameLayer, this.context);
    this.context.navigationController = new NavigationController(this.context.sceneManager);
    this.context.progressController = new ProgressController(this.progressRepository);

    registerScenes(this.context.sceneManager);
  }

  async start(startScene) {
    await this.context.sceneManager.go(startScene);
  }
}
