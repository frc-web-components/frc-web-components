import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '../bar';
import '../axis';
import { WebbitConfig } from '@webbitjs/webbit';

export const numberBarDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Number Bar',
  },
  properties: {
    value: { type: 'Number', primary: true },
    max: { type: 'Number', defaultValue: 1 },
    min: { type: 'Number', defaultValue: -1 },
    center: { type: 'Number' },
    precision: { type: 'Number', defaultValue: 2 },
    hideText: { type: 'Boolean', attribute: 'hide-text' },
    numTickMarks: {
      type: 'Number',
      defaultValue: 3,
      attribute: 'num-tick-marks',
    },
    unit: { type: 'String' },
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(value, min));
}

export class NumberBar extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) center = 0;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'hide-text' }) hideText = false;
  @property({ type: Number, attribute: 'num-tick-marks' }) numTickMarks = 3;
  @property({ type: String }) unit = '';

  static styles = [
    css`
      :host {
        display: inline-block;
        width: 300px;
        height: auto;
        font-family: sans-serif;
      }

      [part='bar'] {
        width: 100%;
        margin: 0;
      }

      [part='bar'] {
        position: relative;
        height: 20px;
        border-radius: 3px;
      }

      [part='axis'] {
        width: calc(100% - 45px);
        margin: 2px auto 0;
        display: block;
      }
    `,
  ];

  render() {
    const min = Math.min(this.min, this.max);
    const max = Math.max(this.min, this.max);

    return html`
      <frc-bar
        value="${this.value}"
        min="${min}"
        max="${max}"
        center="${this.center}"
        part="bar"
      >
        ${!this.hideText
          ? html`
              ${this.value.toFixed(clamp(this.precision, 0, 100))} ${this.unit}
            `
          : ''}
      </frc-bar>
      ${this.numTickMarks > 0
        ? html`
            <frc-axis
              part="axis"
              ticks="${this.numTickMarks}"
              min=${min}
              max=${max}
              unit="${this.unit}"
            ></frc-axis>
          `
        : ''}
    `;
  }
}

export default NumberBar;

if (!customElements.get('frc-number-bar')) {
  customElements.define('frc-number-bar', NumberBar);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-number-bar': NumberBar;
  }
}
