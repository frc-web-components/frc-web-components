import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObjectApi } from './interfaces';

// https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks

type XOrigin = 'left' | 'center' | 'right';
type YOrigin = 'top' | 'center' | 'bottom';

export default class CanvasText extends LitElement {
  @property({ type: String }) text: string | null = '';
  @property({ type: Array }) origin: [number, number] | null = [0, 0];
  @property({ type: Number, attribute: 'max-width' }) maxWidth: number | null =
    null;
  @property({ type: String, attribute: 'font-name' }) fontName: string | null =
    'sans-serif';
  @property({ type: Number, attribute: 'font-size' }) fontSize: number | null =
    12;
  @property({ type: Number }) opacity: number | null = 1;
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
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity ?? 1));
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
    }
    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${this.fontSize ?? 12}px ${this.fontName || 'sans-serif'}`;

    let [x, y] = this.origin ?? [0, 0];
    const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
      ctx.measureText(this.text ?? ''); // TextMetrics object
    const height = actualBoundingBoxAscent + actualBoundingBoxDescent;

    const [xDrawOrigin, yDrawOrigin] = this.drawOrigin ?? ['center', 'center'];

    if (xDrawOrigin === 'left') {
      x += width / 2;
    } else if (xDrawOrigin === 'right') {
      x -= width / 2;
    }

    if (yDrawOrigin === 'top') {
      y += height / 2;
    } else if (yDrawOrigin === 'bottom') {
      y -= height / 2;
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

    if (this.fillColor) {
      ctx.fillText(this.text ?? '', 0, 0);
    }
    if (this.strokeColor) {
      ctx.lineWidth = this.strokeWidth ?? 2;
      ctx.strokeText(this.text ?? '', 0, 0);
    }
  }
}

if (!customElements.get('frc-canvas-text')) {
  customElements.define('frc-canvas-text', CanvasText);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-text': CanvasText;
  }
}
