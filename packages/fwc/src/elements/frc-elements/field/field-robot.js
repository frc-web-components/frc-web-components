import FieldObject from './field-object';
import { toBaseConversions } from './units';

export const elementName = 'frc-field-robot';

export const elementConfig = {
  dashboard: {
    displayName: 'Field Robot',
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
    width: { type: Number, defaultValue: 1 },
    height: { type: Number, defaultValue: 1 },
    unit: {
      type: String,
      defaultValue: 'm',
      input: {
        type: 'StringDropdown',
        getOptions() {
          return Object.keys(toBaseConversions);
        },
        allowCustomValues: false,
      },
    },
    image: { type: String },
    color: {
      type: String,
      input: { type: 'ColorPicker' },
      defaultValue: '#0000ff',
    },
    opacity: {
      type: Number,
      defaultValue: 1,
      input: { type: 'Number', min: 0, max: 100, suffix: '%' },
    },
    pose: { type: Array, primary: true },
    width: { type: Number, defaultValue: 0.6 },
    height: { type: Number, defaultValue: 0.9 },
  },
};

class FieldRobot extends FieldObject {
  static properties = elementConfig.properties;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.width = 1;
    this.height = 1;
    this.unit = 'inherit';
    this.image = '';
    this.color = '#0000ff';
    this.opacity = 100;
    this.pose = [0, 0, 0];
    this.width = 0.6;
    this.height = 0.9;
    this.unit = 'm';
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('pose') && this.pose instanceof Array) {
      const [x = 0, y = 0, angle = 0] = this.pose;
      this.x = x;
      this.y = y;
      this.rot = angle;
    }
  }

  renderDrawing({ bottomCtx, scalingFactor }) {
    bottomCtx.fillStyle = this.color;
    bottomCtx.globalAlpha = Math.max(0, Math.min(1, this.opacity / 100));

    bottomCtx.moveTo(0, 0);
    bottomCtx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    bottomCtx.beginPath();
    bottomCtx.strokeStyle = 'black';
    bottomCtx.lineWidth = this.width * 0.1;
    bottomCtx.moveTo(0, 0);
    bottomCtx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    bottomCtx.stroke();

    // draw arrow
    bottomCtx.beginPath();
    bottomCtx.fillStyle = 'white';
    bottomCtx.moveTo(0, -this.height * 0.3);
    bottomCtx.strokeStyle = 'white';
    bottomCtx.lineWidth = 2 / scalingFactor;

    bottomCtx.lineTo(0, this.height * 0.3);
    bottomCtx.moveTo(-this.width * 0.2, this.height * 0.1);
    bottomCtx.lineTo(0, this.height * 0.3);
    bottomCtx.lineTo(this.width * 0.2, this.height * 0.1);
    bottomCtx.stroke();

    // Draw wheels
    const wheelRadius = Math.min(this.width * 0.17, this.height * 0.19);
    const wheelWidth = wheelRadius;

    const verticalPadding = this.height * 0.1;

    bottomCtx.beginPath();
    bottomCtx.fillStyle = 'black';
    bottomCtx.moveTo(0, 0);

    // front left
    bottomCtx.fillRect(
      -this.width / 2 - wheelWidth / 2,
      this.height / 2 - wheelRadius * 2 - verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );

    // front right
    bottomCtx.fillRect(
      this.width / 2 - wheelWidth / 2,
      this.height / 2 - wheelRadius * 2 - verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );

    // rear left
    bottomCtx.fillRect(
      -this.width / 2 - wheelWidth / 2,
      -this.height / 2 + verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );

    // rear right
    bottomCtx.fillRect(
      this.width / 2 - wheelWidth / 2,
      -this.height / 2 + verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );
  }
}

customElements.define(elementName, FieldRobot);
