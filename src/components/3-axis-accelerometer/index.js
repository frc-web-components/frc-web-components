import { Webbit, html, css } from '@webbitjs/webbit';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

class ThreeAxisAccelerometer extends Webbit {

  static get metadata() {
    return {
      displayName: '3-Axis Accelerometer',
      category: 'Robot & Field Info',
      description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/3-axis-accelerometer/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 100, height: 10 }
    };
  }

  static get properties() {
    return {
      x: { type: Number },
      y: { type: Number },
      z: { type: Number },
      min: { 
        type: Number, 
        get() {
          return Math.min(this._min, this._max);
        }
      },
      max: { 
        type: Number, 
        get() {
          return Math.max(this._min, this._max);
        }
      },
      center: { type: Number },
      precision: { 
        type: Number,
        get() {
          return clamp(this._precision, 0, 100);
        }
      },
      hideText: { type: Boolean, attribute: 'hide-text', reflect: true, },
      numTickMarks: { 
        type: Number, 
        attribute: 'num-tick-marks', 
        reflect: true,
        get() {
          return Math.max(0, this._numTickMarks);
        }
      },
      unit: { type: String }
    };
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

  renderAccelerometer(part, numTickMarks) {
    return html`
      <div part="accelerometer">
        <label part="label">${part}</label>
        <frc-accelerometer
          part="${part}"
          value="${this[part]}"
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
      ${this.renderAccelerometer('x', 0)}
      ${this.renderAccelerometer('y', 0)}
      ${this.renderAccelerometer('z', this.numTickMarks)}
    `;
  }
}

window.webbitRegistry.define('frc-3-axis-accelerometer', ThreeAxisAccelerometer);