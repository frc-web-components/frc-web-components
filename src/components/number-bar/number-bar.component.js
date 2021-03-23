import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';
import { containerStyles } from '../styles';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

 /**
 * Component for display a numerical value in a bar with a min and max range.
 *
 * @attr {Number} value - The value in the number bar
 * @attr {Number} min - The minimum displayed value 
 * @attr {Number} max - The maximum displayed value
 * @attr {Number} center - The point at which the number bar starts. If the value is less than the center, the bar be to the left of the center, and to the right otherwise.
 * @attr {Number} precision - The number of decimal places shown in value.
 * @attr {Boolean} hide-text - If true then the value displayed in the bar is hidden.
 * @attr {Number} num-tick-marks - Controls the number of tick marks shown in the axis at the bottom of the component. If 0 the axis is hidden.
 * @attr {String} unit - Displays a unit for the values shown in the axes.
 * @csspart bar - The number bar
 * @csspart axis - The axis below the number bar
 */
export default class NumberBar extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Number Bar',
      category: 'General',
      description: 'Component for display a numerical value in a bar with a min and max range.',
      documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      resizable: { left: true, right: true },
      minSize: { width: 80, height: 10 },
    };
  }

  static get properties() {
    return {
      value: { type: Number, primary: true, defaultValue: 0 },
      min: { 
        type: Number,
        defaultValue: -1, 
        get() {
          return Math.min(this._min, this._max);
        }
      },
      max: { 
        type: Number, 
        defaultValue: 1,
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
      unit: { type: String, defaultValue: '' }
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          width: 300px;
          height: auto;
          font-family: sans-serif;
        }

        :host([num-tick-marks="0"]) [part=bar] {
          width: 100%;
          margin: 0;
        }

        [part=bar] {
          position: relative;
          width: calc(100% - 40px);
          height: 20px;
          margin: 0 20px;
          border-radius: 3px;
        }

        [part=axis] {
          width: calc(100% - 45px);
          margin: 2px auto 0;
          display: block;
        }
      `
    ];
  }

  render() {
    return html`
      <frc-bar 
        value="${this.value}"
        min="${this.min}"
        max="${this.max}"
        center="${this.center}"
        part="bar"
      >
        ${!this.hideText ? html`
          ${this.value.toFixed(this.precision)}
          ${this.unit}
        ` : ''}
      </frc-bar>
      ${this.numTickMarks > 0 ? html`
        <table-axis 
          part="axis"
          ticks="${this.numTickMarks}"
          .range="${[this.min, this.max]}"
          unit="${this.unit}"
        ></table-axis>
      ` : ''}
    `;
  }
}

define('frc-number-bar', NumberBar);