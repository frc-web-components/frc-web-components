import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class NumberLabel extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Number Label',
      category: 'General',
      description: 'A label for numbers',
      // documentationLink: 'https://frc-web-components.github.io/components/label/',
      slots: [],
      resizable: { left: true, right: true, top: false, bottom: false }
    };
  }

  static get styles() {
    return [
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
        }
      `
    ]
  }

  static get properties() {
    return {
      value: { 
        type: Number, 
        primary: true,
        get() {
          const value = typeof this._value === 'number' 
            ? this._value.toFixed(this.precision)
            : this._value;

          return isNaN(value) ? '' : value;
        }
      },
      precision: { 
        type: Number,
        get() {
          return Math.max(0, this._precision);
        }
      },
    };
  }

  constructor() {
    super();
    this.value = 0;
    this.precision = 2;
  }

  render() {
    return html`${this.value}`;
  }
}

webbitRegistry.define('frc-number-label', NumberLabel);