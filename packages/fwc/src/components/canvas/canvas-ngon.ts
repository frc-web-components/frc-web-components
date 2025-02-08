import { property } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { CanvasObjectApi } from './interfaces';

type XOrigin = 'left' | 'center' | 'right';
type YOrigin = 'top' | 'center' | 'bottom';

export default class CanvasNGon extends LitElement {
  @property({ type: Array }) origin: [number, number] = [0, 0];
  @property({ type: Number }) sides = 5;
  @property({ type: Number }) radius = 10;
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

    if (this.sides < 3) return; // It's not a polygon if it has less than 3 sides
    const angle = (Math.PI * 2) / this.sides; // Calculate the angle between the vertices

    ctx.beginPath();

    for (let i = 0; i < this.sides; i += 1) {
      const currAngle = i * angle;
      const xPos = this.radius * Math.cos(currAngle);
      const yPos = this.radius * Math.sin(currAngle);
      if (i === 0) {
        ctx.moveTo(xPos, yPos); // Move to the first vertex without drawing anything
      } else {
        ctx.lineTo(xPos, yPos); // Draw a line to the next vertex
      }
    }

    ctx.closePath(); // Connect the last vertex with the first

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
  }
}

if (!customElements.get('frc-canvas-ngon')) {
  customElements.define('frc-canvas-ngon', CanvasNGon);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-ngon': CanvasNGon;
  }
}
