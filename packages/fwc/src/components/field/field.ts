import { property, query } from 'lit/decorators.js';
import { html, css, LitElement, TemplateResult } from 'lit';
import fieldConfigs, { FieldConfig } from './field-configs';
import { baseUnit, convert } from './units';
import FieldImages from './field-images';
import './field-robot';
import './field-path';
import { CropType, FieldObjectApi, FieldObject } from './field-interfaces';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export class Field extends LitElement {
  @property({ type: String }) game = fieldConfigs[0].game;
  @property({ type: Number, attribute: 'crop-top' }) cropTop: number | null =
    null;
  @property({ type: Number, attribute: 'crop-bottom' }) cropBottom:
    | number
    | null = null;
  @property({ type: Number, attribute: 'crop-left' }) cropLeft: number | null =
    null;
  @property({ type: Number, attribute: 'crop-right' }) cropRight:
    | number
    | null = null;
  @property({ type: String, attribute: 'crop-type' }) cropType: CropType =
    'percent';
  @property({ type: String }) unit = baseUnit;
  @property({ type: String, attribute: 'rotation-unit' }) rotationUnit:
    | 'deg'
    | 'rad' = 'rad';
  @property({ type: Number }) rotation = 0;
  @property({ type: Boolean, attribute: 'show-grid' }) showGrid = false;
  @property({ type: Number, attribute: 'grid-size' }) gridSize = 1;
  @property({ type: String }) origin: 'red' | 'blue' = 'blue';

  @query('canvas', true)
  canvas!: HTMLCanvasElement;
  @query('.container', true) container!: HTMLElement;

  #fieldImages: FieldImages = new FieldImages();

  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
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

  getCropPercent(): { x1: number; y1: number; x2: number; y2: number } {
    if (this.cropType === 'percent') {
      const x1 = this.cropLeft ?? 0;
      const y1 = this.cropTop ?? 0;
      const x2 = this.cropRight ?? 1;
      const y2 = this.cropBottom ?? 1;
      return { x1, y1, x2, y2 };
    }

    const { corners, image, unit, size } = this.getConfig();
    const { loaded, width, height } = this.#fieldImages.getImage(image);

    if (!loaded) {
      return { x1: 0, y1: 0, x2: 1, y2: 1 };
    }

    const topLeftCrop = [this.cropLeft ?? 0, this.cropTop ?? 0];
    const bottomRightCrop = [
      this.cropRight ?? convert(size[0], unit, this.unit),
      this.cropBottom ?? convert(size[1], unit, this.unit),
    ];

    const x1Corner = corners.topLeft[0] / width;
    const y1Corner = corners.topLeft[1] / height;
    const x2Corner = corners.bottomRight[0] / width;
    const y2Corner = corners.bottomRight[1] / height;

    const widthPercent = x2Corner - x1Corner;
    const heightPercent = y2Corner - y1Corner;

    const value = {
      x1:
        x1Corner +
        (widthPercent * convert(topLeftCrop[0], this.unit, unit)) / size[0],
      y1:
        y1Corner +
        (heightPercent * convert(topLeftCrop[1], this.unit, unit)) / size[1],
      x2:
        x1Corner +
        (widthPercent * convert(bottomRightCrop[0], this.unit, unit)) / size[0],
      y2:
        y1Corner +
        (heightPercent * convert(bottomRightCrop[1], this.unit, unit)) /
          size[1],
    };

    return value;
  }

  getFieldRectPx(): { x: number; y: number; width: number; height: number } {
    const { corners, image } = this.getConfig();
    const { loaded, width, height } = this.#fieldImages.getImage(image);

    if (!loaded) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const x1Percent = corners.topLeft[0] / width;
    const y1Percent = corners.topLeft[1] / height;
    const x2Percent = corners.bottomRight[0] / width;
    const y2Percent = corners.bottomRight[1] / height;

    const cropPercent = this.getCropPercent();
    const cropWidthPercent = cropPercent.x2 - cropPercent.x1;
    const cropHeightPercent = cropPercent.y2 - cropPercent.y1;
    const originalWidth = this.canvas.width / cropWidthPercent;
    const originalHeight = this.canvas.height / cropHeightPercent;

    return {
      x: (x1Percent - cropPercent.x1) * originalWidth,
      y: (y1Percent - cropPercent.y1) * originalHeight,
      width: (x2Percent - x1Percent) * originalWidth,
      height: (y2Percent - y1Percent) * originalHeight,
    };
  }

  pxToX(px: number, unit: string = this.unit): number {
    const fieldRectPx = this.getFieldRectPx();
    const { size, unit: configUnit } = this.getConfig();

    if (fieldRectPx.width === 0) {
      return 0;
    }

    const pxPerUnit = fieldRectPx.width / size[0];

    const pxScaled = px * (this.canvas.width / this.canvas.clientWidth);

    const xValue =
      this.origin !== 'red'
        ? (pxScaled - fieldRectPx.x) / pxPerUnit
        : (fieldRectPx.x + fieldRectPx.width - pxScaled) / pxPerUnit;
    return convert(xValue, configUnit, unit);
  }

  xToPx(xUnits: number, unit: string = this.unit): number {
    const fieldRectPx = this.getFieldRectPx();
    const { size, unit: configUnit } = this.getConfig();

    if (fieldRectPx.width === 0) {
      return 0;
    }

    const pxPerUnit = fieldRectPx.width / size[0];
    const xValue = convert(xUnits, unit, configUnit);
    return this.origin !== 'red'
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
    return this.origin !== 'red'
      ? fieldRectPx.y + fieldRectPx.height - yValue * pxPerUnit
      : fieldRectPx.y + yValue * pxPerUnit;
  }

  pxToY(px: number, unit: string = this.unit): number {
    const fieldRectPx = this.getFieldRectPx();
    const { size, unit: configUnit } = this.getConfig();

    if (fieldRectPx.height === 0) {
      return 0;
    }

    const pxPerUnit = fieldRectPx.height / size[1];

    const pxScaled = px * (this.canvas.height / this.canvas.clientHeight);

    const yValue =
      this.origin !== 'red'
        ? (fieldRectPx.y + fieldRectPx.height - pxScaled) / pxPerUnit
        : (pxScaled - fieldRectPx.y) / pxPerUnit;
    return convert(yValue, configUnit, unit);
  }

  lengthToPx(length: number, unit: string = this.unit): number {
    const fieldRectPx = this.getFieldRectPx();
    const { size, unit: configUnit } = this.getConfig();

    if (fieldRectPx.width === 0) {
      return 0;
    }

    const pxPerUnit = fieldRectPx.width / size[0];
    const lengthConverted = convert(length, unit, configUnit);
    return lengthConverted * pxPerUnit;
  }

  setContainerSize(): void {
    const rect = { width: this.clientWidth, height: this.clientHeight };
    const src = this.getConfig().image;
    const imageObject = this.#fieldImages.getImage(src);
    const { loaded } = imageObject;

    if (!loaded) {
      return;
    }

    const cropPercent = this.getCropPercent();

    const imageDims = {
      width: (cropPercent.x2 - cropPercent.x1) * imageObject.width,
      height: (cropPercent.y2 - cropPercent.y1) * imageObject.height,
    };

    const boundingBoxDims = FieldImages.getBoundingBoxDims(
      imageDims,
      toRadians(this.rotation),
    );

    const dims = FieldImages.fitImageInsideBox(boundingBoxDims, {
      width: rect.width,
      height: rect.height,
    });
    const scale = dims.width / boundingBoxDims.width;
    this.container.style.width = `${imageDims.width * scale}px`;
    this.container.style.height = `${imageDims.height * scale}px`;
  }

  drawImage(): void {
    const ctx = this.getCanvasCtx();
    const src = this.getConfig().image;
    const { loaded, image, width, height } = this.#fieldImages.getImage(src);
    if (!loaded) {
      return;
    }
    const { clientWidth, clientHeight } = this.canvas;
    const canvasWidth = clientWidth * window.devicePixelRatio;
    const canvasHeight = clientHeight * window.devicePixelRatio;
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    const cropPercent = this.getCropPercent();

    ctx.drawImage(
      image,
      cropPercent.x1 * width,
      cropPercent.y1 * height,
      (cropPercent.x2 - cropPercent.x1) * width,
      (cropPercent.y2 - cropPercent.y1) * height,
      0,
      0,
      canvasWidth,
      canvasHeight,
    );
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

  drawChildren(): void {
    const api: FieldObjectApi = {
      canvas: this.getCanvasCtx(),
      getFieldRectPx: () => this.getFieldRectPx(),
      unit: this.unit,
      rotationUnit: this.rotationUnit,
      xToPx: (xUnits, unit) => this.xToPx(xUnits, unit),
      yToPx: (yUnits, unit) => this.yToPx(yUnits, unit),
      lengthToPx: (length, unit) => this.lengthToPx(length, unit),
      origin: this.origin,
    };

    const children = [...this.children].flatMap((child) => {
      if (child.tagName === 'SLOT') {
        return (child as HTMLSlotElement).assignedElements();
      }
      return child;
    });

    children.forEach((child) => {
      const ctx = this.getCanvasCtx();
      ctx.save();
      ctx.beginPath();

      const fieldObject = child as any as FieldObject;
      fieldObject.draw?.(api);

      ctx.restore();
    });
  }

  drawField(): void {
    this.setContainerSize();
    this.drawImage();
    this.drawFieldRect();
    this.drawGrid();
    this.drawChildren();

    window.requestAnimationFrame(() => {
      this.drawField();
    });
  }

  firstUpdated(): void {
    this.drawField();
  }

  #onCanvasClick(ev: MouseEvent) {
    const x = this.pxToX(ev.offsetX);
    const y = this.pxToY(ev.offsetY);
    this.dispatchEvent(
      new CustomEvent('fieldClick', {
        detail: {
          feet: {
            x: convert(x, this.unit, 'ft'),
            y: convert(y, this.unit, 'ft'),
          },
          meters: {
            x: convert(x, this.unit, 'm'),
            y: convert(y, this.unit, 'm'),
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render(): TemplateResult {
    return html`
      <div class="outside-container">
        <div class="container" style="transform: rotate(${-this.rotation}deg)">
          <canvas @click=${this.#onCanvasClick}></canvas>
        </div>
      </div>
    `;
  }
}

export default Field;

if (!customElements.get('frc-field')) {
  customElements.define('frc-field', Field);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field': Field;
  }
}
