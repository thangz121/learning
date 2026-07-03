# Learning World V2

Nền tảng trò chơi giáo dục dành cho trẻ em từ 3 đến 8 tuổi.

## Chạy project

```bash
cd LearningWorldV2
python -m http.server 8000
```

Mở trình duyệt tại http://localhost:8000.

## Kiến trúc

- **Core**: Bootstrap, Game Loop, Event Bus, Scene Manager, Asset Loader, Storage
- **Scenes**: Splash, Main Menu, Course Select, Lesson Select, Gameplay, Result
- **Controllers**: GameplayController, NavigationController, ProgressController
- **Engines**: QuestionEngine, AnswerEngine, FeedbackEngine, AudioEngine, ProgressEngine
- **Repositories**: LessonRepository, QuestionRepository, ProgressRepository, SettingsRepository
- **Renderers**: Select, ImageSelect, Drag, Match, Order, Categorize
- **Components**: Button, Card, ProgressBar, Dialogue, Toast, Modal, Loading

## Quy tắc

- Không framework.
- Không build tools.
- ES Modules.
- Console Zero.
- Acceptance Test PASS.
