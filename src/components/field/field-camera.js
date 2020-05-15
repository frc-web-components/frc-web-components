import FieldDrawing from './field-drawing';

class FieldCamera extends FieldDrawing {

  static get properties() {
    return {
      ...super.properties,
      fov: { type: Number },
      angle: { type: Number },
      x: { type: Number },
      y: { type: Number },
      range: { type: Number },
      seesTarget: { type: Boolean },
      targetDistance: { 
        type: Number,
        converter: (value) => {
          return parseFloat(value);
        },
        get() {
          return isNaN(this._targetDistance) ? this.range : this._targetDistance;
        }
      }
    };
  }

  constructor() {
    super();
    this.fov = 60;
    this.angle = 0;
    this.x = 0;
    this.y = 0;
    this.range = 5;
    this.seesTarget = false;
  }

  renderDrawing({ ctx, scalingFactor, parentWidth, parentHeight }) {

    const distance = this.seesTarget ? this.targetDistance : this.range;

    // draw FOV
    if (this.fov > 0) {
      ctx.save();
      ctx.lineWidth = 1 / scalingFactor;
      ctx.fillStyle = this.seesTarget ? 'rgba(0, 255, 0, .4)' : 'rgba(255, 0, 0, .4)';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle * Math.PI / 180);
      ctx.moveTo(0, 0);
      const x = distance * Math.tan(this.fov / 2 * Math.PI / 180);

      ctx.lineTo(-x, distance);
      ctx.lineTo(x, distance);
      ctx.fill();
      ctx.restore();
    } else {
      // draw line to target
      ctx.beginPath();
      ctx.lineWidth = 1 / scalingFactor;
      ctx.strokeStyle = this.seesTarget ? "rgb(0, 255, 0)" : 'rgb(255, 0, 0)';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle * Math.PI / 180);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, distance);
      ctx.stroke();
    }
  }
}

webbitRegistry.define('frc-field-camera', FieldCamera);