import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

export default class NumberBar extends Webbit {

  static get metadata() {
    return {
      displayName: 'Number Bar',
      category: 'General',
      description: 'Component for display a numerical value in a bar with a min and max range.xw',
      documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 80, height: 10 },
    };
  }

  static get properties() {
    return {
      ...super.properties,
      value: { type: Number, primary: true },
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

webbitRegistry.define('frc-number-bar', NumberBar);