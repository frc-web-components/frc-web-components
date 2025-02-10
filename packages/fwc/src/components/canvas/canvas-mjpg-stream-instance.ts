import { css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import throttle from 'lodash.throttle';
import { CanvasObjectApi } from './interfaces';

export default class CanvasMjpgStreamInstance extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Number }) width: number | null = null;
  @property({ type: Number }) height: number | null = null;
  @property({ type: Array }) origin: [number, number] = [0, 0];
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, attribute: 'hide-crosshair' }) hideCrosshair =
    false;
  @property({ type: String, attribute: 'crosshair-color' }) crosshairColor =
    'white';

  private image = new Image();

  private connected = false;
  private loadedTimeout?: NodeJS.Timeout;
  private throttleUpdateImage = throttle(() => this.updateImage(), 5000);
  private onImageLoadBound = this.onImageLoad.bind(this);
  private onImageErrorBound = this.onImageError.bind(this);

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
  `;

  private getImageSize(canvas: HTMLCanvasElement): {
    width: number;
    height: number;
  } {
    const containerSize = {
      width: this.width || canvas.width,
      height: this.height || canvas.height,
    };
    if (
      (this.image.height / this.image.width) * containerSize.width >
      containerSize.height
    ) {
      return {
        height: containerSize.height,
        width: (this.image.width / this.image.height) * containerSize.height,
      };
    }
    return {
      height: (this.image.height / this.image.width) * containerSize.width,
      width: containerSize.width,
    };
  }

  protected draw({ ctx, canvas }: CanvasObjectApi): void {
    const { width, height } = this.getImageSize(canvas);
    const containerSize = {
      width: this.width || canvas.width,
      height: this.height || canvas.height,
    };

    const [x, y] = this.origin ?? [0, 0];

    ctx.translate(x, y);

    if (!this.connected) {
      return;
    }

    try {
      const drawX = (containerSize.width - width) / 2;
      const drawY = (containerSize.height - height) / 2;

      ctx.drawImage(this.image, drawX, drawY, width, height);

      // draw crosshair
      if (!this.hideCrosshair) {
        ctx.strokeStyle = this.crosshairColor || 'white';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.setLineDash([7, 7]);
        ctx.moveTo(drawX, drawY + height / 2);
        ctx.lineTo(drawX + width, drawY + height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(drawX + width / 2, drawY);
        ctx.lineTo(drawX + width / 2, drawY + height);
        ctx.stroke();
      }
    } catch {
      this.throttleUpdateImage();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.loadedTimeout);
    this.image.src = '';
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.throttleUpdateImage();
  }

  private isImageLoaded() {
    return this.image.complete && this.image.naturalHeight !== 0;
  }

  private updateImage() {
    clearTimeout(this.loadedTimeout);

    if (this.disabled) {
      return;
    }

    if (!this.isConnected) {
      this.setConnected(false);
      return;
    }

    if (this.isImageLoaded()) {
      return;
    }

    this.loadedTimeout = setTimeout(() => {
      this.throttleUpdateImage();
    }, 5000);
    this.image.removeEventListener('load', this.onImageLoadBound);
    this.image.removeEventListener('error', this.onImageErrorBound);
    this.image.src = '';
    this.image = new Image();
    this.setConnected(false);
    this.image.src = this.src ?? '';
    this.image.addEventListener('load', this.onImageLoadBound);
    this.image.addEventListener('error', this.onImageErrorBound);
  }

  private setConnected(connected: boolean) {
    if (this.connected && !connected) {
      this.connected = false;
      this.dispatchDisconnect();
    } else if (!this.connected && connected) {
      this.connected = true;
      this.dispatchConnect();
    }
  }

  private onImageLoad() {
    this.setConnected(true);
    clearTimeout(this.loadedTimeout);
  }

  private onImageError() {
    this.throttleUpdateImage();
  }

  private dispatchConnect(): void {
    this.dispatchEvent(
      new CustomEvent('connect', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private dispatchDisconnect(): void {
    this.dispatchEvent(
      new CustomEvent('disconnect', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('src')) {
      this.throttleUpdateImage();
    }

    if (changedProps.has('disabled')) {
      if (this.disabled) {
        clearTimeout(this.loadedTimeout);
        this.image.src = '';
      } else {
        this.throttleUpdateImage();
      }
    }
  }
}

if (!customElements.get('frc-canvas-mjpg-stream-instance')) {
  customElements.define(
    'frc-canvas-mjpg-stream-instance',
    CanvasMjpgStreamInstance,
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-mjpg-stream-instance': CanvasMjpgStreamInstance;
  }
}
