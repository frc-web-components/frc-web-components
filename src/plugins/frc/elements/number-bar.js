import { html, css, LitElement } from 'lit';
import { containerStyles } from '../styles';

export const elementName = 'frc-number-bar';

export const elementConfig = {
  dashboard: {
    displayName: 'Number Bar',
  },
  properties: {
    value: { type: Number, primary: true },
    max: { type: Number, defaultValue: 1 },
    min: { type: Number, defaultValue: -1 },
    center: { type: Number },
    precision: { type: Number, defaultValue: 2 },
    hideText: { type: Boolean, attribute: 'hide-text' },
    numTickMarks: {
      type: Number,
      defaultValue: 3,
      attribute: 'num-tick-marks',
    },
    unit: { type: String },
  },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

export default class NumberBar extends LitElement {
  static properties = elementConfig.properties;

  static styles = [
    containerStyles,
    css`
      :host {
        display: inline-block;
        width: 300px;
        height: auto;
        font-family: sans-serif;
      }

      :host([num-tick-marks='0']) [part='bar'] {
        width: 100%;
        margin: 0;
      }

      [part='bar'] {
        position: relative;
        width: calc(100% - 40px);
        height: 20px;
        margin: 0 20px;
        border-radius: 3px;
      }

      [part='axis'] {
        width: calc(100% - 45px);
        margin: 2px auto 0;
        display: block;
      }
    `,
  ];

  constructor() {
    super();
    this.value = 0;
    this.max = 1;
    this.min = -1;
    this.center = 0;
    this.precision = 2;
    this.hideText = false;
    this.numTickMarks = 3;
    this.unit = '';
  }

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
            <frc-table-axis
              part="axis"
              ticks="${this.numTickMarks}"
              .range="${[min, max]}"
              unit="${this.unit}"
            ></frc-table-axis>
          `
        : ''}
    `;
  }
}

customElements.define(elementName, NumberBar);
