/**
 * ProgressEngine - Tính toán tiến trình.
 */
export class ProgressEngine {
  calculate({ correct, wrong, duration, total }) {
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    let stars = 0;
    if (score >= 90) stars = 3;
    else if (score >= 70) stars = 2;
    else if (score >= 50) stars = 1;
    return { correct, wrong, score, stars, duration };
  }
}
