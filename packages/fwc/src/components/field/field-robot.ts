import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { FieldObjectApi } from './field-interfaces';

export class FieldRobot extends LitElement {
  @property({ type: String }) unit: string | null = 'inherit';
  @property({ type: String, attribute: 'rotation-unit' }) rotationUnit:
    | string
    | null = 'inherit';
  @property({ type: String }) image = '';
  @property({ type: String }) color = '#0000ff';
  @property({ type: Number }) opacity = 1;
  @property({ type: Array }) pose = [0, 0, 0];
  @property({ type: Number }) width = 0.6;
  @property({ type: Number }) length = 0.9;

  draw({
    canvas,
    unit: parentUnit,
    rotationUnit: parentRotationUnit,
    xToPx,
    yToPx,
    lengthToPx,
    origin,
  }: FieldObjectApi): void {
    const unit =
      this.unit === 'inherit' || this.unit === null ? parentUnit : this.unit;
    const rotationUnit =
      this.rotationUnit === 'inherit' || this.rotationUnit === null
        ? parentRotationUnit
        : this.rotationUnit;
    const [x, y] = this.pose;
    const angle =
      rotationUnit === 'rad' ? this.pose[2] : this.pose[2] / (180 / Math.PI);

    canvas.globalAlpha = Math.max(0, Math.min(1, this.opacity));
    canvas.fillStyle = '#222';
    canvas.strokeStyle = this.color;
    canvas.lineWidth = lengthToPx(3, 'in');

    canvas.translate(xToPx(x, unit), yToPx(y, unit));
    canvas.rotate(-angle + (origin === 'red' ? Math.PI : 0));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.roundRect(
      -lengthToPx(this.length / 2, unit),
      -lengthToPx(this.width / 2, unit),
      lengthToPx(this.length, unit),
      lengthToPx(this.width, unit),
      1,
    );
    canvas.fill();
    canvas.stroke();

    // draw arrow
    canvas.beginPath();
    canvas.fillStyle = 'white';
    canvas.strokeStyle = 'white';
    canvas.lineWidth = lengthToPx(2, 'in');

    canvas.moveTo(-lengthToPx(this.length * 0.3, unit), 0);
    canvas.lineTo(lengthToPx(this.length * 0.3, unit), 0);

    canvas.moveTo(
      lengthToPx(this.length * 0.1, unit),
      -lengthToPx(this.width * 0.25, unit),
    );
    canvas.lineTo(lengthToPx(this.length * 0.3, unit), 0);
    canvas.lineTo(
      lengthToPx(this.length * 0.1, unit),
      lengthToPx(this.width * 0.25, unit),
    );

    canvas.stroke();
  }
}

if (!customElements.get('frc-field-robot')) {
  customElements.define('frc-field-robot', FieldRobot);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field-robot': FieldRobot;
  }
}
