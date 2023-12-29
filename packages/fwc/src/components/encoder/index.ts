import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const encoderDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Encoder',
  },
  properties: {
    distance: { type: 'Number' },
    speed: { type: 'Number' },
  },
};

export class Encoder extends LitElement {
  @property({ type: Number }) distance = 0;
  @property({ type: Number }) speed = 0;

  static styles = css`
    :host {
      display: inline-grid;
      grid-template-columns: min-content auto;
      grid-template-rows: 50% 50%;
      column-gap: 15px;
      row-gap: 5px;
      align-items: center;
      width: 250px;
      font-family: sans-serif;
    }

    label {
      font-weight: bold;
      text-align: right;
      color: var(--frc-encoder-label-color, #000);
    }

    span {
      width: 100%;
      min-width: 50px;
      display: inline-block;
      padding: 5px;
      border: 1px dashed;
      border-color: var(--frc-encoder-value-color, #666);
      color: var(--frc-encoder-value-color, #666);
      border-radius: 3px;
      box-sizing: border-box;
    }
  `;

  render() {
    return html`
      <label class="distance-label">Distance</label>
      <span>${this.distance}</span>
      <label class="speed-label">Speed</label>
      <span>${this.speed}</span>
    `;
  }
}

export default Encoder;

if (!customElements.get('frc-encoder')) {
  customElements.define('frc-encoder', Encoder);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-encoder': Encoder;
  }
}
