/* ============================================================
   Scene-specific Styles
   ============================================================ */

/* Splash */
.scene--splash {
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-xl);
}

.scene--splash .title {
  margin-top: var(--space-lg);
}

/* Main Menu */
.scene--main-menu {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.scene--main-menu .scene__stage {
  align-items: center;
  gap: var(--space-xl);
}

.scene--main-menu .button {
  min-width: 280px;
  font-size: var(--font-size-lg);
}

/* Course Select */
.scene--course-select .scene__stage {
  align-items: center;
}

.scene--course-select .button {
  min-width: 240px;
}

/* Lesson Select */
.scene--lesson-select .card {
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.scene--lesson-select .card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Gameplay */
.scene--gameplay {
  padding: var(--space-sm);
}

.scene--gameplay .gameplay-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.gameplay-nav {
  width: 100%;
  max-width: 900px;
  margin: 0 auto var(--space-sm);
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}

.gameplay-nav .button {
  min-height: 40px;
  padding: 8px 14px;
  font-size: var(--font-size-sm);
}

/* Result */
.scene--result {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.scene--result .scene__stage {
  align-items: center;
  gap: var(--space-lg);
}

.scene--result p {
  font-size: var(--font-size-xl);
  margin: var(--space-xs) 0;
}
