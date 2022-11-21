import FieldObject from './field-object';

export const elementName = 'frc-field-camera';

export const elementConfig = {
  dashboard: {
    displayName: 'Field Camera',
    topLevel: false,
    layout: {
      resizable: {
        horizontal: false,
        vertical: false,
      },
      movable: false,
    },
  },
  properties: {
    x: { type: Number },
    y: { type: Number },
    rot: { type: Number },
    unit: {
      type: String,
      defaultValue: 'inherit',
    },
    image: { type: String },
    fov: { type: Number, defaultValue: 60 },
    range: { type: Number, defaultValue: 3 },
    seesTarget: { type: Boolean, attribute: 'sees-target' },
    targetDistance: { type: Number, attribute: 'target-distance' },
  },
};

class FieldCamera extends FieldObject {
  static properties = elementConfig.properties;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.unit = 'inherit';
    this.image = '';
    this.fov = 60;
    this.range = 3;
    this.seesTarget = false;
    this.targetDistance = 0;
  }

  renderDrawing({ ctx, scalingFactor }) {
    const targetDistance =
      this.targetDistance < 0 ? this.range : this.targetDistance;
    const distance = this.seesTarget ? targetDistance : this.range;

    // draw FOV
    if (this.fov > 0) {
      ctx.save();
      ctx.lineWidth = 1 / scalingFactor;
      ctx.fillStyle = this.seesTarget
        ? 'rgba(0, 255, 0, .4)'
        : 'rgba(255, 0, 0, .4)';
      // ctx.translate(this.x, this.y);
      ctx.moveTo(0, 0);
      const x = distance * Math.tan(((this.fov / 2) * Math.PI) / 180);

      ctx.lineTo(-x, distance);
      ctx.lineTo(x, distance);
      ctx.fill();
      ctx.restore();
    } else {
      // draw line to target
      ctx.beginPath();
      ctx.lineWidth = 1 / scalingFactor;
      ctx.strokeStyle = this.seesTarget ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';
      // ctx.translate(this.x, this.y);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, distance);
      ctx.stroke();
    }
  }
}

customElements.define(elementName, FieldCamera);
