import { html, css } from '@webbitjs/webbit';
import { Webbit, define } from '../../webbit';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

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
class ThreeAxisAccelerometer extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: '3-Axis Accelerometer',
      category: 'Robot & Field Info',
      description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/3-axis-accelerometer/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      resizable: { left: true, right: true },
      minSize: { width: 100, height: 10 }
    };
  }

  static get properties() {
    return {
      x: { type: Number, defaultValue: 0 },
      y: { type: Number, defaultValue: 0 },
      z: { type: Number, defaultValue: 0 },
      min: { 
        type: Number,
        defaultValue: -16,
        get() {
          return Math.min(this._min, this._max);
        }
      },
      max: { 
        type: Number,
        defaultValue: 16,
        get() {
          return Math.max(this._min, this._max);
        }
      },
      center: { type: Number, defaultValue: 0 },
      precision: { 
        type: Number,
        defaultValue: 2,
        get() {
          return clamp(this._precision, 0, 100);
        }
      },
      hideText: { type: Boolean },
      numTickMarks: { 
        type: Number,
        defaultValue: 3,
        get() {
          return Math.max(0, this._numTickMarks);
        }
      },
      unit: { type: String, defaultValue: 'g' }
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

define('frc-3-axis-accelerometer', ThreeAxisAccelerometer);