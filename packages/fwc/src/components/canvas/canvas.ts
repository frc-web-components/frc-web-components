import { html, css, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { CanvasObject, CanvasObjectApi } from './interfaces';
import './canvas-line';
import './canvas-rect';
import './canvas-circle';
import './canvas-ngon';
import './canvas-group';
import './canvas-text';
import './canvas-mjpg-stream';

export class Canvas extends LitElement {
  @query('canvas') canvas!: HTMLCanvasElement;
  @property({ type: Number }) width: number | null = null;
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    'black';

  static styles = css`
    :host {
      display: inline-block;
      width: 400px;
      height: 300px;
    }

    canvas {
      width: 100%;
      height: 100%;
    }

    [part='box'] {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      background-color: var(--box-color);
      text-align: center;
    }
  `;

  private getCanvasCtx(): CanvasRenderingContext2D {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    return ctx;
  }

  private drawChildren(): void {
    const api: CanvasObjectApi = {
      canvas: this.canvas,
      ctx: this.getCanvasCtx(),
      domRect: this.getBoundingClientRect(),
    };

    [...this.children].forEach((child) => {
      const ctx = this.getCanvasCtx();
      ctx.save();
      ctx.beginPath();

      const canvasObject = child as any as CanvasObject;
      canvasObject.draw?.(api);

      ctx.restore();
    });
  }

  private drawBackground(): void {
    const ctx = this.getCanvasCtx();
    ctx.save();
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
  }

  private drawCanvas(): void {
    this.drawBackground();
    this.drawChildren();

    window.requestAnimationFrame(() => {
      this.drawCanvas();
    });
  }

  protected firstUpdated(): void {
    this.drawCanvas();

    // resize observer
    const observer = new ResizeObserver(() => this.resized());
    observer.observe(this);
    this.resized();
  }

  private resized() {
    const rect = this.getBoundingClientRect();
    const { width, height } = rect;

    if (typeof this.width !== 'number') {
      this.canvas.width = width;
      this.canvas.height = height;
    } else {
      this.canvas.width = this.width;
      this.canvas.height = (this.width * height) / width;
    }
  }

  protected render(): TemplateResult {
    return html` <canvas></canvas> `;
  }
}

export default Canvas;

if (!customElements.get('frc-canvas')) {
  customElements.define('frc-canvas', Canvas);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas': Canvas;
  }
}
