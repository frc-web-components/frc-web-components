import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObject, CanvasObjectApi } from './interfaces';

export default class CanvasGroup extends LitElement {
  @property({ type: Array }) transform: number[] | null = [0, 0, 0];
  @property({ type: Array, attribute: 'transform-origin' }) transformOrigin:
    | number[]
    | null = [0, 0];
  @property({ type: Array, attribute: 'z-index' }) zIndex = 0;

  draw(api: CanvasObjectApi): void {
    const { ctx } = api;

    // Transform
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

    // Draw children
    [...this.children].forEach((child) => {
      ctx.save();
      ctx.beginPath();

      const canvasObject = child as any as CanvasObject;
      canvasObject.draw?.(api);

      ctx.restore();
    });
  }
}

if (!customElements.get('frc-canvas-group')) {
  customElements.define('frc-canvas-group', CanvasGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-group': CanvasGroup;
  }
}
