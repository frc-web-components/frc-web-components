import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';

export const labelDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Label',
  },
  properties: {
    text: { type: 'String', primary: true },
  },
  demos: [{ html: '<frc-label text="label"></frc-label>' }],
};

export class Label extends LitElement {
  @property({ type: String }) text = '';

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
    return html`${this.text}`;
  }
}

export default Label;

if (!customElements.get('frc-label')) {
  customElements.define('frc-label', Label);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-label': Label;
  }
}
