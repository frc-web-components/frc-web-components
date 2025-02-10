import { LitElement, TemplateResult, html } from 'lit';
import { property, state, queryAll } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CanvasObject, CanvasObjectApi } from './interfaces';
import './canvas-mjpg-stream-instance';

export default class CanvasMjpgStream extends LitElement {
  static DEFAULT_WAIT_IMAGE = './no-camera-stream.jpg';

  @property({ type: Array }) srcs: string[] = [];
  @property({ type: Number }) width: number | null = null;
  @property({ type: Number }) height: number | null = null;
  @property({ type: Array }) origin: [number, number] = [0, 0];
  @property({ type: String, attribute: 'wait-image' }) waitImage =
    CanvasMjpgStream.DEFAULT_WAIT_IMAGE;
  @property({ type: Boolean, attribute: 'hide-crosshair' }) hideCrosshair =
    false;
  @property({ type: String, attribute: 'crosshair-color' }) crosshairColor =
    'white';

  @state() _connectedSrc?: string;

  @queryAll('frc-canvas-mjpg-stream-instance')
  streamInstances!: NodeListOf<HTMLElement>;

  private waitImageElement = new Image();

  private getImageSize(canvas: HTMLCanvasElement): {
    width: number;
    height: number;
  } {
    const containerSize = {
      width: this.width || canvas.width,
      height: this.height || canvas.height,
    };
    if (
      (this.waitImageElement.height / this.waitImageElement.width) *
        containerSize.width >
      containerSize.height
    ) {
      return {
        height: containerSize.height,
        width:
          (this.waitImageElement.width / this.waitImageElement.height) *
          containerSize.height,
      };
    }
    return {
      height:
        (this.waitImageElement.height / this.waitImageElement.width) *
        containerSize.width,
      width: containerSize.width,
    };
  }

  protected draw(api: CanvasObjectApi): void {
    const { canvas, ctx } = api;
    const streamInstance = [...this.streamInstances].find(
      (child: any) => child.src === this._connectedSrc,
    ) as CanvasObject | undefined;

    if (streamInstance) {
      streamInstance.draw(api);
    } else {
      const { width, height } = this.getImageSize(canvas);
      const containerSize = {
        width: this.width || canvas.width,
        height: this.height || canvas.height,
      };

      const [x, y] = this.origin ?? [0, 0];

      ctx.translate(x, y);

      try {
        ctx.drawImage(
          this.waitImageElement,
          (containerSize.width - width) / 2,
          (containerSize.height - height) / 2,
          width,
          height,
        );
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  protected updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('srcs')) {
      if (this._connectedSrc && !this.srcs.includes(this._connectedSrc)) {
        this._connectedSrc = undefined;
      }
    }

    if (changedProps.has('waitImage')) {
      this.waitImageElement.src = this.waitImage;
    }
  }

  private onConnect(src: string) {
    if (!this._connectedSrc) {
      this._connectedSrc = src;
    }
  }

  private onDisconnect(src: string) {
    if (this._connectedSrc === src) {
      this._connectedSrc = undefined;
    }
  }

  private renderStreamInstance(src: string) {
    return html`
      ${keyed(
        src,
        html`
          <frc-canvas-mjpg-stream-instance
            @connect=${() => this.onConnect(src)}
            @disconnect=${() => this.onDisconnect(src)}
            src=${src}
            width=${ifDefined(this.width !== null ? this.width : undefined)}
            height=${ifDefined(this.height !== null ? this.height : undefined)}
            .origin=${ifDefined(this.origin !== null ? this.origin : undefined)}
            ?disabled=${this._connectedSrc && this._connectedSrc !== src}
            ?hide-crosshair=${this.hideCrosshair}
            crosshair-color=${this.crosshairColor}
          ></frc-canvas-mjpg-stream-instance>
        `,
      )}
    `;
  }

  render(): TemplateResult {
    return html`
      ${this.srcs.map((src) =>
        this.renderStreamInstance(src.replace('mjpg:', '')),
      )}
    `;
  }
}

if (!customElements.get('frc-canvas-mjpg-stream')) {
  customElements.define('frc-canvas-mjpg-stream', CanvasMjpgStream);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-canvas-mjpg-stream': CanvasMjpgStream;
  }
}
