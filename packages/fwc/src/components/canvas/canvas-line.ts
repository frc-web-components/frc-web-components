import { property, state } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObjectApi } from './interfaces';
import getPoses from '../field/get-poses';

type XOrigin = 'left' | 'center' | 'right';
type YOrigin = 'top' | 'center' | 'bottom';

export default class CanvasLine extends LitElement {
  @property({ type: Array }) points: Uint8Array | number[] = [];
  @property({ type: Number }) opacity = 1;
  @property({ type: String }) color: string | null = null;
  @property({ type: Number, attribute: 'line-width' }) lineWidth = 2;
  @property({ type: Array }) transform: number[] | null = [0, 0, 0];
  @property({ type: Array, attribute: 'transform-origin' }) transformOrigin:
    | number[]
    | null = [0, 0];
  @property({ type: Array, attribute: 'draw-origin' }) drawOrigin:
    | [XOrigin, YOrigin]
    | null = ['left', 'top'];
  @property({ type: Array, attribute: 'z-index' }) zIndex = 0;

  @state() _points: (Uint8Array | number[])[] = [];

  protected updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('points')) {
      this._points = getPoses(this.points, 2);
    }
  }

  protected draw({ ctx }: CanvasObjectApi): void {
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
    ctx.lineWidth = this.lineWidth ?? 2;
    ctx.strokeStyle = this.color ?? 'gray';

    const [transformX, transformY, transformRotation] = this.transform ?? [
      0, 0, 0,
    ];

    ctx.translate(transformX, transformY);

    const [XTransformOrigin, yTransformOrigin] = this.transformOrigin ?? [0, 0];

    const xTranform = XTransformOrigin;
    const yTranform = yTransformOrigin;
    ctx.translate(xTranform, yTranform); // move the origin
    ctx.rotate(-(transformRotation * Math.PI) / 180); // rotate
    ctx.translate(-xTranform, -yTranform); // move the origin back

    if (this._points.length > 1) {
      for (let i = 0; i < this._points.length - 1; i += 1) {
        const [x1, y1] = this._points[i];
        const [x2, y2] = this._points[i + 1];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }

      ctx.stroke();
    }
  }
}

if (!customElements.get('frc-canvas-line')) {
  customElements.define('frc-canvas-line', CanvasLine);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-line': CanvasLine;
  }
}
