import { LitElement, html, css } from 'lit-element';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Component for displaying data from a 3-axis accelerometer.
 *
 * @attr {Number} x - The acceleration in the X axis
 * @attr {Number} y - The acceleration in the Y axis
 * @attr {Number} z - The acceleration in the Z axis
 * @attr {Number} min - The minimum displayed acceleration
 * @attr {Number} max - The maximum displayed acceleration
 * @attr {Number} center - The point at which the number bar starts. If the x, y and z values are less than the center, the bar be to the left of the center, and to the right otherwise.
 * @attr {Number} precision - The number of decimal places shown in the x, y and z values.
 * @attr {Boolean} hide-text - If true then the x, y and z values displayed in the bars are hidden.
 * @attr {Number} num-tick-marks - Controls the number of tick marks shown in the axis at the bottom of the component. If 0 the axis is hidden.
 * @attr {String} unit - Displays a unit for the values shown in the axes.
 * @csspart accelerometer - Containers for each number bar and their axis label
 * @csspart label - The labels on the left side of the number bars
 * @csspart x - The number bar display the X axis value
 * @csspart y - The number bar display the Y axis value
 * @csspart z - The number bar display the Z axis value
 */
class ThreeAxisAccelerometer extends LitElement {

  static get properties() {
    return {
      x: { type: Number, reflect: true },
      y: { type: Number, reflect: true },
      z: { type: Number, reflect: true },
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      center: { type: Number, reflect: true },
      precision: { type: Number, reflect: true },
      hideText: { type: Boolean, attribute: 'hide-text', reflect: true, },
      numTickMarks: { type: Number, attribute: 'num-tick-marks', reflect: true },
      unit: { type: String, reflect: true }
    };
  }

  get min() {
    const min = isNumber(this._min) ? this._min : -16;
    const max = isNumber(this._max) ? this._max : 16;
    return Math.min(min, max);
  }

  set min(value) {
    const oldValue = this._min;
    this._min = value;
    this.requestUpdate('min', oldValue);
  }

  get max() {
    const min = isNumber(this._min) ? this._min : -16;
    const max = isNumber(this._max) ? this._max : 16;
    return Math.max(min, max);
  }

  set max(value) {
    const oldValue = this._max;
    this._max = value;
    this.requestUpdate('max', oldValue);
  }

  get precision() {
    const precision = isNumber(this._precision) ? this._precision : 2;
    return clamp(precision, 0, 100);
  }

  set precision(value) {
    const oldValue = this._precision;
    this._precision = value;
    this.requestUpdate('precision', oldValue);
  }
  
  get numTickMarks() {
    const numTickMarks = isNumber(this._numTickMarks) ? this._numTickMarks : 3;
    return Math.max(0, numTickMarks);
  }

  set numTickMarks(value) {
    const oldValue = this._numTickMarks;
    this._numTickMarks = value;
    this.requestUpdate('numTickMarks', oldValue);
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        flex-direction: column;
        height: auto;
        font-family: sans-serif;
        width: 300px;
      }

      [part=accelerometer] {
        width: 100%;
        display: flex;
        margin-bottom: 10px;
      }

      [part=accelerometer]:last-child {
        margin-bottom: 0;
      }

      [part=accelerometer] label {
        width: 10px;
        padding-top: 2px;
        font-weight: bold;
        text-transform: uppercase;
      }

      frc-accelerometer {
        width: 100%;
        flex: 1;
      }

      :host(:not([num-tick-marks="0"])) frc-accelerometer::part(bar) {
        width: calc(100% - 40px);
        margin: 0 20px;
      }

      :host([num-tick-marks="0"]) frc-accelerometer::part(bar) {
        width: 100%;
        margin: 0;
      }
    `;
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.min = -16;
    this.max = 16;
    this.center = 0;
    this.precision = 2;
    this.hideText = false;
    this.numTickMarks = 3;
    this.unit = 'g';
  }

  /**
   * @protected
   */
  renderAccelerometer(part, numTickMarks) {
    return html`
      <div part="accelerometer">
        <label part="label">${part}</label>
        <frc-accelerometer
          part="${part}"
          value="${this[part] || 0}"
          min="${this.min}"
          max="${this.max}"
          center="${this.center || 0}"
          precision="${this.precision}"
          ?hide-text="${this.hideText}"
          num-tick-marks="${numTickMarks}"
          unit="${typeof this.unit === 'string' ? this.unit : 'g'}"
        ></frc-accelerometer>
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderAccelerometer('x', 0)}
      ${this.renderAccelerometer('y', 0)}
      ${this.renderAccelerometer('z', this.numTickMarks)}
    `;
  }
}

customElements.define('frc-3-axis-accelerometer', ThreeAxisAccelerometer);

webbitRegistry.addExisting('frc-3-axis-accelerometer', {
  displayName: '3-Axis Accelerometer',
  category: 'Robot & Field Info',
  description: 'Component for displaying data from a 3-axis accelerometer.',
  documentationLink: 'https://frc-web-components.github.io/components/3-axis-accelerometer/',
  slots: [],
  editorTabs: ['properties', 'sources'],
  resizable: { left: true, right: true },
  minSize: { width: 100, height: 10 },
  properties: {
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
    min: { type: Number },
    max: { type: Number },
    center: { type: Number },
    precision: { type: Number },
    hideText: { type: Boolean },
    numTickMarks: { type: Number },
    unit: { type: String }
  }
});