import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';

export const numberLabelDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Number Label',
  },
  properties: {
    value: { type: 'Number', primary: true },
    precision: { type: 'Number', defaultValue: 2 },
  },
};

export class NumberLabel extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) precision = 2;

  static styles = css`
    :host {
      display: inline;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      text-align: inherit;
      margin: 0;
      padding: 0;
      color: var(--frc-label-text-color, black);
    }
  `;

  render() {
    const precision = Math.max(0, this.precision);
    const value = this.value.toFixed(precision);
    return html`${value}`;
  }
}

export default NumberLabel;

if (!customElements.get('frc-number-label')) {
  customElements.define('frc-number-label', NumberLabel);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-number-label': NumberLabel;
  }
}
