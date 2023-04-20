import { customElement, property, query } from 'lit/decorators.js';
import { html, css, LitElement, TemplateResult } from 'lit';
import fieldConfigs, { FieldConfig } from './field-configs';
import { baseUnit, toBaseConversions, convert, unitAliases } from './units';
import FieldImages from './field-images';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

@customElement('frc-field2')
export class Field extends LitElement {
  @property({ type: String }) game = fieldConfigs[0].game;
  @property({ type: Array, attribute: 'top-left-clip' }) topLeftClip: [
    number,
    number
  ] = [0, 0];
  @property({ type: Array, attribute: 'bottom-right-clip' }) bottomRightClip: [
    number,
    number
  ] = [100, 100];
  @property({ type: String }) unit = baseUnit;
  @property({ type: Number }) rotation = 0;
  @property({ type: Boolean, attribute: 'show-grid' }) showGrid = false;
  @property({ type: Number, attribute: 'grid-size' }) gridSize = 1;
  @property({ type: Boolean, attribute: 'flip-side' }) flipSide = false;

  @query('canvas', true)
  canvas!: HTMLCanvasElement;
  @query('.container', true) container!: HTMLElement;

  #fieldImages: FieldImages = new FieldImages();
  #onImageLoadUnsub = (): void => {
    /* noop */
  };

  static styles = css`
    :host {
      display: inline-flex;
      width: 500px;
      height: 300px;
      justify-content: center;
      align-items: center;
    }

    .container {
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  getConfig(): FieldConfig {
    const config = fieldConfigs.find(({ game }) => game === this.game);
    return config ?? fieldConfigs[0];
  }

  getCanvasCtx(): CanvasRenderingContext2D {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    return ctx;
  }

  getFieldRectPx(): { x: number; y: number; width: number; height: number } {
    const { corners, image } = this.getConfig();
    const { loaded, width, height } = this.#fieldImages.getImage(image);

    if (!loaded) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const x1 = corners.topLeft[0] / width;
    const y1 = corners.topLeft[1] / height;
    const x2 = corners.bottomRight[0] / width;
    const y2 = corners.bottomRight[1] / height;

    return {
      x: x1 * this.canvas.width,
      y: y1 * this.canvas.height,
      width: (x2 - x1) * this.canvas.width,
      height: (y2 - y1) * this.canvas.height,
    };
  }

  xToPx(xUnits: number, unit: string = this.unit): number {
    const fieldRectPx = this.getFieldRectPx();
    const { size, unit: configUnit } = this.getConfig();

    if (fieldRectPx.width === 0) {
      return 0;
    }

    const pxPerUnit = fieldRectPx.width / size[0];
    const xValue = convert(xUnits, unit, configUnit);
    return !this.flipSide
      ? fieldRectPx.x + xValue * pxPerUnit
      : fieldRectPx.x + fieldRectPx.width - xValue * pxPerUnit;
  }

  yToPx(yUnits: number, unit: string = this.unit): number {
    const fieldRectPx = this.getFieldRectPx();
    const { size, unit: configUnit } = this.getConfig();

    if (fieldRectPx.height === 0) {
      return 0;
    }

    const pxPerUnit = fieldRectPx.height / size[1];
    const yValue = convert(yUnits, unit, configUnit);
    return !this.flipSide
      ? fieldRectPx.y + fieldRectPx.height - yValue * pxPerUnit
      : fieldRectPx.y + yValue * pxPerUnit;
  }

  setContainerSize(): void {
    const rect = this.getBoundingClientRect();
    const src = this.getConfig().image;
    const imageObject = this.#fieldImages.getImage(src);
    const { loaded } = imageObject;

    if (!loaded) {
      return;
    }
    const boundingBoxDims = FieldImages.getBoundingBoxDims(
      imageObject,
      toRadians(this.rotation)
    );
    const dims = FieldImages.fitImageInsideBox(boundingBoxDims, {
      width: rect.width,
      height: rect.height,
    });
    const scale = dims.width / boundingBoxDims.width;
    this.container.style.width = `${imageObject.width * scale}px`;
    this.container.style.height = `${imageObject.height * scale}px`;
  }

  drawImage(): void {
    const ctx = this.getCanvasCtx();
    const src = this.getConfig().image;
    const { loaded, image } = this.#fieldImages.getImage(src);
    if (!loaded) {
      return;
    }
    const { clientWidth, clientHeight } = this.canvas;
    const canvasWidth = clientWidth * window.devicePixelRatio;
    const canvasHeight = clientHeight * window.devicePixelRatio;
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  }

  drawFieldRect(): void {
    const ctx = this.getCanvasCtx();
    const { x, y, width, height } = this.getFieldRectPx();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
  }

  drawGrid(): void {
    const ctx = this.getCanvasCtx();
    const { image, size } = this.getConfig();
    const { loaded } = this.#fieldImages.getImage(image);

    if (!loaded || !this.showGrid || this.gridSize <= 0) {
      return;
    }

    // Set the stroke width and color
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';

    for (let x = 0; x <= size[0]; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(this.xToPx(x), this.yToPx(0));
      ctx.lineTo(this.xToPx(x), this.yToPx(size[1]));
      ctx.stroke();
    }

    for (let y = 0; y <= size[1]; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(this.xToPx(0), this.yToPx(y));
      ctx.lineTo(this.xToPx(size[0]), this.yToPx(y));
      ctx.stroke();
    }
  }

  drawField(): void {
    this.setContainerSize();
    this.drawImage();
    this.drawFieldRect();
    this.drawGrid();

    window.requestAnimationFrame(() => {
      this.drawField();
    });
  }

  firstUpdated(): void {
    this.drawField();
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html`
      <div class="container" style="transform: rotate(${-this.rotation}deg)">
        <canvas></canvas>
      </div>
    `;
  }
}
