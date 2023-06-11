/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import throttle from 'lodash.throttle';
import { CanvasObjectApi } from './interfaces';

class PingStream {
  static TIMEOUT = 'TIMEOUT';
  static ABORT = 'ABORT';
  static UPDATE_STREAM = 'UPDATE_STREAM';

  private src?: string;
  private abortController?: AbortController;

  private enabled = false;

  setEnabled(isEnabled: boolean) {
    if (this.enabled !== isEnabled) {
      this.abortController?.abort(PingStream.ABORT);
      this.enabled = isEnabled;

      if (this.enabled) {
        this.ping();
      }
    }
  }

  setStream(src: string) {
    this.src = src;
    this.abortController?.abort(PingStream.UPDATE_STREAM);
    this.ping();
  }

  ping() {
    if (this.src) {
      const abortController = new AbortController();
      this.abortController = abortController;
      setTimeout(() => {
        abortController.abort(PingStream.TIMEOUT);
      }, 5000);
      fetch(this.src, {
        signal: abortController.signal,
      })
        .then(() => {
          this.ping();
        })
        .catch(() => {
          if (abortController.signal.reason === PingStream.TIMEOUT) {
            this.ping();
          }
        });
    }
  }
}

export default class CanvasMjpgStreamInstance extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Number }) width: number | null = null;
  @property({ type: Number }) height: number | null = null;
  @property({ type: Array }) origin: [number, number] = [0, 0];
  @property({ type: Boolean }) disabled = false;

  private image = new Image();

  private connected = false;
  private loadedTimeout?: NodeJS.Timeout;
  private throttleUpdateImage = throttle(() => this.updateImage(), 5000);
  private onImageLoadBound = this.onImageLoad.bind(this);
  private onImageErrorBound = this.onImageError.bind(this);

  private pingStream = new PingStream();

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
      // this.pingStream.setStream(this.src);
    }

    if (changedProps.has('disabled')) {
      if (this.disabled) {
        clearTimeout(this.loadedTimeout);
        this.image.src = '';
      } else {
        this.throttleUpdateImage();
      }

      // this.pingStream.setEnabled(!this.disabled);
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
