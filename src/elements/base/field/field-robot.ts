/* eslint-disable no-param-reassign */
import { customElement, property, query } from 'lit/decorators.js';
import { html, css, LitElement, TemplateResult } from 'lit';
import { convert, toBaseConversions } from './units';
import { FieldObject } from './field';

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

@customElement('frc-field-robot')
export default class FieldRobot extends LitElement {
  @property({ type: String }) unit = 'inherit';
  @property({ type: String }) image = '';
  @property({ type: String }) color = '#0000ff';
  @property({ type: Number }) opacity = 1;
  @property({ type: Array }) pose = [0, 0, 0];
  @property({ type: Number }) width = 0.6;
  @property({ type: Number }) height = 0.9;

  draw({ canvas, unit }: FieldObject): void {
    canvas.fillStyle = this.color;
    canvas.globalAlpha = Math.max(0, Math.min(1, this.opacity));

    const unitScale = convert(1, unit, this.unit);
    canvas.scale(unitScale, unitScale);

    canvas.moveTo(0, 0);
    canvas.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    canvas.beginPath();
    canvas.strokeStyle = 'black';
    canvas.lineWidth = this.width * 0.1;
    canvas.moveTo(0, 0);
    canvas.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    canvas.stroke();

    // draw arrow
    canvas.beginPath();
    canvas.fillStyle = 'white';
    canvas.moveTo(0, -this.height * 0.3);
    canvas.strokeStyle = 'white';
    // canvas.lineWidth = 2 / scalingFactor;

    canvas.lineTo(0, this.height * 0.3);
    canvas.moveTo(-this.width * 0.2, this.height * 0.1);
    canvas.lineTo(0, this.height * 0.3);
    canvas.lineTo(this.width * 0.2, this.height * 0.1);
    canvas.stroke();

    // Draw wheels
    const wheelRadius = Math.min(this.width * 0.17, this.height * 0.19);
    const wheelWidth = wheelRadius;

    const verticalPadding = this.height * 0.1;

    canvas.beginPath();
    canvas.fillStyle = 'black';
    canvas.moveTo(0, 0);

    // front left
    canvas.fillRect(
      -this.width / 2 - wheelWidth / 2,
      this.height / 2 - wheelRadius * 2 - verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );

    // front right
    canvas.fillRect(
      this.width / 2 - wheelWidth / 2,
      this.height / 2 - wheelRadius * 2 - verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );

    // rear left
    canvas.fillRect(
      -this.width / 2 - wheelWidth / 2,
      -this.height / 2 + verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );

    // rear right
    canvas.fillRect(
      this.width / 2 - wheelWidth / 2,
      -this.height / 2 + verticalPadding,
      wheelWidth,
      wheelRadius * 2
    );
  }
}
