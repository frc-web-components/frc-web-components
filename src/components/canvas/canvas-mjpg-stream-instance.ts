/* eslint-disable no-underscore-dangle */
import { css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import throttle from 'lodash.throttle';
import { CanvasObjectApi } from './interfaces';

// mjpg:http://roboRIO-2423-FRC.local:1181/?action=stream, mjpg:http://10.24.23.2:1181/?action=stream, mjpg:http://169.254.33.181:1181/?action=stream]

export default class CanvasMjpgStreamInstance extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Number }) width: number | null = null;
  @property({ type: Number }) height: number | null = null;
  @property({ type: Array }) origin: [number, number] = [0, 0];

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
      width: this.width ?? canvas.width,
      height: this.height ?? canvas.height,
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
      width: this.width ?? canvas.width,
      height: this.height ?? canvas.height,
    };

    const [x, y] = this.origin ?? [0, 0];

    ctx.translate(x, y);

    if (this.connected) {
      try {
        ctx.drawImage(
          this.image,
          (containerSize.width - width) / 2,
          (containerSize.height - height) / 2,
          width,
          height
        );
      } catch (e) {
        this.throttleUpdateImage();
      }
    }
  }

  private updateImage() {
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
      })
    );
  }

  private dispatchDisconnect(): void {
    this.dispatchEvent(
      new CustomEvent('disconnect', {
        bubbles: true,
        composed: true,
      })
    );
  }

  protected updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('src')) {
      this.throttleUpdateImage();
    }
  }
}

if (!customElements.get('frc-canvas-mjpg-stream-instance')) {
  customElements.define(
    'frc-canvas-mjpg-stream-instance',
    CanvasMjpgStreamInstance
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-mjpg-stream-instance': CanvasMjpgStreamInstance;
  }
}
