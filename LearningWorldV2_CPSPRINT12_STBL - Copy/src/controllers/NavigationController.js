/**
 * NavigationController - Điều hướng giữa các Scene.
 * Tương lai: quản lý lịch sử điều hướng.
 */
export class NavigationController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  goTo(sceneName, data) {
    this.sceneManager.go(sceneName, data);
  }

  back() {
    this.sceneManager.back();
  }
}
