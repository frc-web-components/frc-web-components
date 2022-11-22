const easeOut = (t) => t * (2 - t);

export default class RotationAnimator {
  constructor(svg, startingAngle) {
    this.svg = svg;
    this.angle = null;
    this.setAngle(startingAngle);
    this.animationStartAngle = startingAngle;
    this.animationEndAngle = startingAngle;
    this.animationStartTime = 0;
    this.animationTime = 0;
    this.duration = 1;

    const step = () => {
      if (this.duration > this.animationTime) {
        this.animationTime = Math.min(
          (Date.now() - this.animationStartTime) / 1000,
          this.duration
        );
      }
      const t = easeOut(this.animationTime / this.duration);
      this.setAngle(
        this.animationStartAngle +
          t * (this.animationEndAngle - this.animationStartAngle)
      );

      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  animate(angle) {
    this.animationStartTime = Date.now();
    this.animationTime = 0;
    this.animationStartAngle = this.angle;
    this.animationEndAngle = angle;
  }

  setAngle(angle) {
    this.angle = angle;
    this.svg.style.setProperty('--deg', `${angle}deg`);
  }

  setDuration(duration) {
    this.duration = duration;
  }
}
