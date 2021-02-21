import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class NumberLabel extends Webbit {

  static get metadata() {
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
      value: { type: Number, primary: true },
      precision: { type: Number }
    };
  }

  constructor() {
    super();
    this.value = 0;
    this.precision = 2;
  }

  render() {
    return html`${this.value.toFixed(Math.max(0, this.precision))}`;
  }
}

webbitRegistry.define('frc-number-label', NumberLabel);