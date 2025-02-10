import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObjectApi } from './interfaces';

type XOrigin = 'left' | 'center' | 'right';
type YOrigin = 'top' | 'center' | 'bottom';

export default class CanvasCircle extends LitElement {
  @property({ type: Array }) origin: [number, number] = [0, 0];
  @property({ type: Number }) radius = 10;
  @property({ type: Number, attribute: 'start-angle' }) startAngle:
    | number
    | null = 0;
  @property({ type: Number, attribute: 'end-angle' }) endAngle: number | null =
    360;
  @property({ type: Number }) opacity = 1;
  @property({ type: String, attribute: 'stroke-color' }) strokeColor:
    | string
    | null = null;
  @property({ type: Number, attribute: 'stroke-width' }) strokeWidth = 2;
  @property({ type: String, attribute: 'fill-color' }) fillColor:
    | string
    | null = 'gray';
  @property({ type: Array }) transform: number[] | null = [0, 0, 0];
  @property({ type: Array, attribute: 'transform-origin' }) transformOrigin:
    | number[]
    | null = [0, 0];
  @property({ type: Array, attribute: 'draw-origin' }) drawOrigin:
    | [XOrigin, YOrigin]
    | null = ['center', 'center'];
  @property({ type: Array, attribute: 'z-index' }) zIndex = 0;

  draw({ ctx }: CanvasObjectApi): void {
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
    }
    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = this.strokeWidth;
    }

    let [x, y] = this.origin;
    const [xDrawOrigin, yDrawOrigin] = this.drawOrigin ?? ['center', 'center'];

    if (xDrawOrigin === 'left') {
      x += this.radius;
    } else if (xDrawOrigin === 'right') {
      x -= this.radius;
    }

    if (yDrawOrigin === 'top') {
      y += this.radius;
    } else if (yDrawOrigin === 'bottom') {
      y -= this.radius;
    }

    const [transformX, transformY, transformRotation] = this.transform ?? [
      0, 0, 0,
    ];

    x += transformX;
    y += transformY;

    ctx.translate(x, y);

    const [XTransformOrigin, yTransformOrigin] = this.transformOrigin ?? [0, 0];

    const xTranform = XTransformOrigin;
    const yTranform = yTransformOrigin;
    ctx.translate(xTranform, yTranform); // move the origin
    ctx.rotate(-(transformRotation * Math.PI) / 180); // rotate
    ctx.translate(-xTranform, -yTranform); // move the origin back

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius,
      (-(this.startAngle ?? 0) * Math.PI) / 180,
      (-(this.endAngle ?? 360) * Math.PI) / 180,
      true,
    );

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
  }
}

if (!customElements.get('frc-canvas-circle')) {
  customElements.define('frc-canvas-circle', CanvasCircle);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-circle': CanvasCircle;
  }
}
