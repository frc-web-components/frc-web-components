import { css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import throttle from 'lodash.throttle';
import { CanvasObjectApi } from './interfaces';

export interface CameraStreamParams {
  resolution?: { width: number; height: number };
  fps?: number;
  quality?: number;
}

/**
 * Creates a camera stream URL with appropriate parameters
 * Adapted from https://github.com/Gold872/elastic-dashboard
 *
 * @param urlString Base camera stream URL
 * @param params Camera parameters (resolution, fps, quality)
 * @returns URL with query parameters
 */
export function getUrlWithParameters(
  urlString: string,
  params: CameraStreamParams,
): string {
  const url = new URL(urlString);

  // Add resolution parameter if valid (exclude if -1 or undefined)
  if (params.resolution) {
    let width = params.resolution.width;
    const height = params.resolution.height;

    // Skip resolution if either dimension is -1 or invalid
    if (width !== -1 && height !== -1 && width > 0 && height > 0) {
      // Ensure width is even (round up if odd)
      if (width % 2 !== 0) {
        width += 1;
      }

      url.searchParams.set(
        'resolution',
        `${Math.floor(width)}x${Math.floor(height)}`,
      );
    }
  }

  // Add fps parameter if provided and valid (exclude if -1 or undefined)
  if (params.fps !== undefined && params.fps !== -1 && params.fps > 0) {
    url.searchParams.set('fps', params.fps.toString());
  }

  // Add compression/quality parameter if provided and valid (exclude if -1 or undefined)
  if (
    params.quality !== undefined &&
    params.quality !== -1 &&
    params.quality >= 0 &&
    params.quality <= 100
  ) {
    url.searchParams.set('compression', Math.floor(params.quality).toString());
  }

  return url.toString();
}

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
  @property({ type: Number, attribute: 'resolution-width' })
  resolutionWidth?: number;
  @property({ type: Number, attribute: 'resolution-height' })
  resolutionHeight?: number;
  @property({ type: Number }) fps?: number;
  @property({ type: Number }) quality?: number;

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

    // Apply URL parameters for resolution, fps, and quality
    const resolution =
      this.resolutionWidth &&
      this.resolutionHeight &&
      this.resolutionWidth !== -1 &&
      this.resolutionHeight !== -1
        ? { width: this.resolutionWidth, height: this.resolutionHeight }
        : undefined;

    const params: CameraStreamParams = {
      resolution,
      fps: this.fps,
      quality: this.quality,
    };
    const urlWithParams = getUrlWithParameters(this.src ?? '', params);

    // Check if the URL has changed or if image is not loaded
    if (this.isImageLoaded() && this.image.src === urlWithParams) {
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

    this.image.src = urlWithParams;

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
    if (
      changedProps.has('src') ||
      changedProps.has('resolutionWidth') ||
      changedProps.has('resolutionHeight') ||
      changedProps.has('fps') ||
      changedProps.has('quality')
    ) {
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
