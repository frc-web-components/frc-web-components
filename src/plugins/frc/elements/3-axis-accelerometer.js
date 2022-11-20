import { html, css, LitElement } from 'lit';

export const elementName = 'frc-3-axis-accelerometer';

export const elementConfig = {
  dashboard: {
    displayName: '3-Axis Accelerometer',
  },
  properties: {
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
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
    unit: { type: String, defaultValue: 'g' },
  },
};

class ThreeAxisAccelerometer extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      height: auto;
      font-family: sans-serif;
      width: 300px;
    }

    [part='accelerometer'] {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
    }

    [part='accelerometer']:last-child {
      margin-bottom: 0;
    }

    [part='accelerometer'] label {
      width: 10px;
      padding-top: 2px;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--frc-3-axis-accelerometer-label-color, #000);
    }

    frc-accelerometer {
      width: 100%;
      flex: 1;
    }

    :host(:not([num-tick-marks='0'])) frc-accelerometer::part(bar) {
      width: calc(100% - 40px);
      margin: 0 20px;
    }

    :host([num-tick-marks='0']) frc-accelerometer::part(bar) {
      width: 100%;
      margin: 0;
    }
  `;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.max = 1;
    this.min = -1;
    this.center = 0;
    this.precision = 2;
    this.hideText = false;
    this.numTickMarks = 3;
    this.unit = 'g';
  }

  renderAccelerometer(part, numTickMarks) {
    return html`
      <div part="accelerometer">
        <label part="label">${part}</label>
        <frc-accelerometer
          part="${part}"
          value="${this[part] || 0}"
          min="${this.min}"
          max="${this.max}"
          center="${this.center}"
          precision="${this.precision}"
          ?hide-text="${this.hideText}"
          num-tick-marks="${numTickMarks}"
          unit="${this.unit}"
        ></frc-accelerometer>
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderAccelerometer('x', 0)} ${this.renderAccelerometer('y', 0)}
      ${this.renderAccelerometer('z', this.numTickMarks)}
    `;
  }
}

customElements.define(elementName, ThreeAxisAccelerometer);
