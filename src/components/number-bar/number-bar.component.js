import { LitElement, html, css } from 'lit-element';
import { containerStyles } from '../styles';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

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
export default class NumberBar extends LitElement {

  static get properties() {
    return {
      value: { type: Number, reflect: true },
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

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.center = 0;
    this.precision = 2;
    this.hideText = false;
    this.numTickMarks = 3;
    this.unit = '';
  }

  render() {
    return html`
      <frc-bar 
        value="${this.value || 0}"
        min="${this.min}"
        max="${this.max}"
        center="${this.center || 0}"
        part="bar"
      >
        ${!this.hideText ? html`
          ${this.value.toFixed(this.precision)}
          ${this.unit || ''}
        ` : ''}
      </frc-bar>
      ${this.numTickMarks > 0 ? html`
        <table-axis 
          part="axis"
          ticks="${this.numTickMarks}"
          .range="${[this.min, this.max]}"
          unit="${this.unit || ''}"
        ></table-axis>
      ` : ''}
    `;
  }
}

customElements.define('frc-number-bar', NumberBar);

webbitRegistry.addExisting('frc-number-bar', {
  displayName: 'Number Bar',
  category: 'General',
  description: 'Component for display a numerical value in a bar with a min and max range.',
  documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
  slots: [],
  editorTabs: ['properties', 'sources'],
  resizable: { left: true, right: true },
  minSize: { width: 80, height: 10 },
  properties: {
    value: { type: Number, primary: true, defaultValue: 0 },
    min: { type: Number, defaultValue: -1 },
    max: { type: Number, defaultValue: 1 },
    center: { type: Number, defaultValue: 0 },
    precision: { type: Number, defaultValue: 2 },
    hideText: { type: Boolean, defaultValue: false },
    numTickMarks: { type: Number, defaultValue: 3 },
    unit: { type: String, defaultValue: '' }
  }
});