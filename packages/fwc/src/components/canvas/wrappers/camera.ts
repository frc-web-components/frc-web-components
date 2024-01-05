import { LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import '../canvas';
import { WebbitConfig } from '@webbitjs/webbit';
import CanvasMjpgStream from '../canvas-mjpg-stream';

export const cameraDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Camera',
  },
  properties: {
    streams: { type: 'Array' },
    backgroundColor: {
      type: 'String',
      attribute: 'background-color',
      defaultValue: '#000000',
      input: { type: 'ColorPicker' },
    },
    waitImage: {
      type: 'String',
      attribute: 'wait-image',

      // input: { type: 'Upload' },
    },
    hideCrosshair: {
      type: 'Boolean',
      attribute: 'hide-crosshair',
    },
    crosshairColor: {
      type: 'String',
      attribute: 'crosshair-color',
      defaultValue: '#ffffff',
      input: { type: 'ColorPicker' },
    },
  },
};

export class CameraWrapper extends LitElement {
  @property({ type: Array }) streams: string[] = [];
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    'black';
  @property({ type: String, attribute: 'wait-image' }) waitImage =
    CanvasMjpgStream.DEFAULT_WAIT_IMAGE;
  @property({ type: Boolean, attribute: 'hide-crosshair' }) hideCrosshair =
    false;
  @property({ type: String, attribute: 'crosshair-color' }) crosshairColor =
    'white';

  static styles = css`
    :host {
      display: inline-block;
      width: 400px;
      height: 300px;
    }

    frc-canvas {
      width: 100%;
      height: 100%;
    }
  `;

  protected render(): TemplateResult {
    return html`
      <frc-canvas background-color=${this.backgroundColor}>
        <frc-canvas-mjpg-stream
          wait-image=${this.waitImage}
          crosshair-color=${this.crosshairColor}
          ?hide-crosshair=${this.hideCrosshair}
          .srcs=${this.streams}
        ></frc-canvas-mjpg-stream>
      </frc-canvas>
    `;
  }
}

if (!customElements.get('frc-camera-wrapper')) {
  customElements.define('frc-camera-wrapper', CameraWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-camera-wrapper': CameraWrapper;
  }
}
