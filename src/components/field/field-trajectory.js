import FieldDrawing from './field-drawing';

class FieldTrajectory extends FieldDrawing {

  static get properties() {
    return {
      ...super.properties,
      xs: { type: Array },
      ys: { type: Array },
      startRotation: { type: Number },
      endRotation: { type: Number }
    };
  }

  constructor() {
    super();
    this.xs = [];
    this.ys = [];
    this.startRotation = 0;
    this.endRotation = 0;
  }

  renderDrawing({ bottomCtx, scalingFactor, parentWidth, parentHeight }) {
    bottomCtx.lineWidth = 4 / scalingFactor;
    bottomCtx.strokeStyle = "rgba(235, 164, 52, .5)";

    for (let i = 0; i < this.xs.length - 1; i++) {
      bottomCtx.moveTo(this.ys[i], this.xs[i]);
      bottomCtx.lineTo(this.ys[i + 1], this.xs[i + 1]);
    }

    bottomCtx.stroke();

    this.drawArrow(bottomCtx, this.xs[0], this.ys[0], this.startRotation, scalingFactor);
    const lastIndex = this.xs.length - 1;
    this.drawArrow(bottomCtx, this.xs[lastIndex], this.ys[lastIndex], this.endRotation, scalingFactor);  
  }

  drawArrow(ctx, x, y, rotation, scalingFactor) {
    ctx.save();
    ctx.translate(y, x);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.fillStyle = "rgba(255, 174, 72)";
    ctx.moveTo(0, 0);
    ctx.lineTo(- 5 / scalingFactor, 0);
    ctx.lineTo(0, 10 / scalingFactor);
    ctx.lineTo(5 / scalingFactor, 0);
    ctx.fill();

    ctx.restore();

  }
}

webbitRegistry.define('frc-field-trajectory', FieldTrajectory);