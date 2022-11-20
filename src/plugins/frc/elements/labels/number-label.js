import { containerStyles } from '../../styles';
import { html, css, LitElement } from 'lit';

export const elementName = 'frc-number-label';

export const elementConfig = {
  dashboard: {
    displayName: 'Number Label',
  },
  properties: {
    value: { type: Number, primary: true },
    precision: { type: Number, defaultValue: 2 },
  },
};

class NumberLabel extends LitElement {
  static properties = elementConfig.properties;

  static styles = [
    containerStyles,
    css`
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
    `,
  ];

  constructor() {
    super();
    this.value = 0;
    this.precision = 2;
  }

  render() {
    const precision = Math.max(0, this.precision);
    const value = this.value.toFixed(precision);
    return html`${value}`;
  }
}

customElements.define(elementName, NumberLabel);
