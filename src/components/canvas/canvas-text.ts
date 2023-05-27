/* eslint-disable no-param-reassign */
import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObjectApi } from './interfaces';

type TextAlign = 'left' | 'right' | 'center';
type TextBaseline =
  | 'top'
  | 'hanging'
  | 'middle'
  | 'alphabetic'
  | 'ideographic'
  | 'bottom';

export default class CanvasText extends LitElement {
  @property({ type: String }) text: string | null = '';
  @property({ type: Array }) origin: [number, number] | null = [0, 0];
  @property({ type: Number, attribute: 'max-width' }) maxWidth: number | null =
    null;
  @property({ type: String, attribute: 'font-name' }) fontName: string | null =
    'sans-serif';
  @property({ type: Number, attribute: 'font-size' }) fontSize:
    | number
    | null = 12;
  @property({ type: Number }) opacity: number | null = 1;
  @property({ type: String, attribute: 'stroke-color' }) strokeColor:
    | string
    | null = null;
  @property({ type: String, attribute: 'fill-color' }) fillColor:
    | string
    | null = 'gray';

  @property({ type: String, attribute: 'text-align' }) textAlign: TextAlign =
    'left';
  @property({ type: String, attribute: 'text-baseline' })
  textBaseline: TextBaseline = 'alphabetic';
  @property({ type: Array }) transform: number[] | null = [0, 0, 0];
  @property({ type: Array, attribute: 'transform-origin' }) transformOrigin:
    | number[]
    | null = [0, 0];
  @property({ type: Array, attribute: 'z-index' }) zIndex = 0;

  draw({ ctx }: CanvasObjectApi): void {
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity ?? 1));
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
    }
    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
    }

    ctx.textAlign = this.textAlign || 'start';
    ctx.textBaseline = this.textBaseline || 'alphabetic';
    ctx.font = `${this.fontSize ?? 12}px ${this.fontName || 'sans-serif'}`;

    let [x, y] = this.origin ?? [0, 0];
    // const height = this.fontSize ?? 12;
    const { width } = ctx.measureText(this.text ?? ''); // TextMetrics object

    const [transformX, transformY, transformRotation] = this.transform ?? [
      0, 0, 0,
    ];

    x += transformX;
    y += transformY;

    ctx.translate(x, y);

    const [XTransformOrigin, yTransformOrigin] = this.transformOrigin ?? [0, 0];

    const xTranform = XTransformOrigin + width / 2;
    const yTranform = yTransformOrigin;
    ctx.translate(xTranform, yTranform); // move the origin
    ctx.rotate(-(transformRotation * Math.PI) / 180); // rotate
    ctx.translate(-xTranform, -yTranform); // move the origin back

    if (this.fillColor) {
      ctx.fillText(this.text ?? '', 0, 0);
    }
    if (this.strokeColor) {
      ctx.strokeText(this.text ?? '', 0, 0);
    }
  }
}

if (!customElements.get('frc-canvas-text')) {
  customElements.define('frc-canvas-text', CanvasText);
}
