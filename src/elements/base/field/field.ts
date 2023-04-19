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

  @query('canvas', true) canvas!: HTMLCanvasElement;
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
      background: green;
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

  setContainerSize(): void {
    const rect = this.getBoundingClientRect();
    const src = this.getConfig().image;
    const imageObject = this.#fieldImages.getImage(src);
    const { loaded } = imageObject;

    if (loaded) {
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
  }

  drawImage(): void {
    const ctx = this.getCanvasCtx();
    const src = this.getConfig().image;
    const { loaded, image, width, height } = this.#fieldImages.getImage(src);
    console.log('draw', { loaded, image, width, height });
    if (loaded) {
      this.canvas.width = width;
      this.canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      this.setContainerSize();
    }
  }

  firstUpdated(): void {
    this.#onImageLoadUnsub = this.#fieldImages.onImageLoad(() => {
      this.drawImage();
    });

    const resizeObserver = new ResizeObserver(() => this.setContainerSize());
    resizeObserver.observe(this);
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('game') || changedProps.has('rotation')) {
      this.drawImage();
    }
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
