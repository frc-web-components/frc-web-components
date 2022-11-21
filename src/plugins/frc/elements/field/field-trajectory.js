import FieldObject from './field-object';
import getPoses from './get-poses';

export const elementName = 'frc-field-trajectory';

export const elementConfig = {
  dashboard: {
    displayName: 'Field Trajectory',
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
    data: { type: Object, primary: true, attribute: false },
    color: {
      type: String,
      input: { type: 'ColorPicker' },
      defaultValue: '#FFA500',
    },
  },
};

class FieldTrajectory extends FieldObject {
  static properties = {
    ...elementConfig.properties,
    _poses: { state: true },
  };

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.unit = 'm';
    this.data = [];
    this.color = '#FFA500';
    this._poses = [];
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('data')) {
      this._poses = getPoses(this.data);
    }
  }

  renderDrawing({ bottomCtx, scalingFactor }) {
    bottomCtx.lineWidth = 4 / scalingFactor;
    bottomCtx.strokeStyle = this.color;
    bottomCtx.globalAlpha = 0.5;

    if (this._poses.length < 2) {
      return;
    }

    const startingPose = this._poses.at(0) ?? [0, 0, 0];
    const endingPose = this._poses.at(-1) ?? [0, 0, 0];

    for (let i = 0; i < this._poses.length - 1; i++) {
      const [x1, y1] = this._poses[i];
      const [x2, y2] = this._poses[i + 1];
      bottomCtx.moveTo(-y1, x1);
      bottomCtx.lineTo(-y2, x2);
    }

    bottomCtx.stroke();

    this.drawArrow(
      bottomCtx,
      startingPose[0],
      -startingPose[1],
      startingPose[2],
      scalingFactor
    );
    this.drawArrow(
      bottomCtx,
      endingPose[0],
      -endingPose[1],
      endingPose[2],
      scalingFactor
    );
  }

  drawArrow(ctx, x, y, rotation, scalingFactor) {
    ctx.save();
    ctx.translate(y, x);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.moveTo(0, 0);
    ctx.lineTo(-7 / scalingFactor, 0);
    ctx.lineTo(0, 12 / scalingFactor);
    ctx.lineTo(7 / scalingFactor, 0);
    ctx.fill();

    ctx.restore();
  }
}

customElements.define(elementName, FieldTrajectory);
