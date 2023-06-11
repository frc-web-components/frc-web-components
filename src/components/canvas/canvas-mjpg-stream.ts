/* eslint-disable no-underscore-dangle */
import { LitElement, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { CanvasObject, CanvasObjectApi } from './interfaces';
import './canvas-mjpg-stream-instance';

// mjpg:http://roboRIO-2423-FRC.local:1181/?action=stream, mjpg:http://10.24.23.2:1181/?action=stream, mjpg:http://169.254.33.181:1181/?action=stream]

export default class CanvasMjpgStream extends LitElement {
  @property({ type: Array }) srcs: string[] = [];
  @property({ type: Number }) width: number | null = null;
  @property({ type: Number }) height: number | null = null;
  @property({ type: Array }) origin: [number, number] = [0, 0];

  @state() _connectedSrc?: string;

  protected draw(api: CanvasObjectApi): void {
    const streamInstance = [...this.children].find(
      (child: any) => child.src === this._connectedSrc
    ) as CanvasObject | undefined;
    streamInstance?.draw(api);
  }

  protected updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('srcs')) {
      if (this._connectedSrc && !this.srcs.includes(this._connectedSrc)) {
        this._connectedSrc = undefined;
      }
      // this.throttleUpdateImage();
    }
  }

  private onConnect(src: string) {
    if (!this._connectedSrc) {
      this._connectedSrc = src;
    }
  }

  private onDisconnect(src: string) {
    this._connectedSrc = '';
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
            width=${this.width}
            height=${this.height}
            origin=${this.origin}
          ></frc-canvas-mjpg-stream-instance>
        `
      )}
    `;
  }

  render(): TemplateResult {
    if (this._connectedSrc) {
      return this.renderStreamInstance(this._connectedSrc);
    }

    return html` ${this.srcs.map((src) => this.renderStreamInstance(src))} `;
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
