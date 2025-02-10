import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObjectApi } from './interfaces';

type XOrigin = 'left' | 'center' | 'right';
type YOrigin = 'top' | 'center' | 'bottom';

export default class CanvasRect extends LitElement {
  @property({ type: Array }) origin: [number, number] = [0, 0];
  @property({ type: Number }) width = 10;
  @property({ type: Number }) height = 10;
  @property({ type: Number }) radii = 0;
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

    if (xDrawOrigin === 'center') {
      x -= this.width / 2;
    } else if (xDrawOrigin === 'right') {
      x -= this.width;
    }

    if (yDrawOrigin === 'center') {
      y -= this.height / 2;
    } else if (yDrawOrigin === 'bottom') {
      y -= this.height;
    }

    const [transformX, transformY, transformRotation] = this.transform ?? [
      0, 0, 0,
    ];

    x += transformX;
    y += transformY;

    ctx.translate(x, y);

    const [XTransformOrigin, yTransformOrigin] = this.transformOrigin ?? [0, 0];

    const xTranform = XTransformOrigin + this.width / 2;
    const yTranform = yTransformOrigin + this.height / 2;
    ctx.translate(xTranform, yTranform); // move the origin
    ctx.rotate(-(transformRotation * Math.PI) / 180); // rotate
    ctx.translate(-xTranform, -yTranform); // move the origin back

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.roundRect(0, 0, this.width, this.height, this.radii);

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
  }
}

if (!customElements.get('frc-canvas-rect')) {
  customElements.define('frc-canvas-rect', CanvasRect);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-rect': CanvasRect;
  }
}
