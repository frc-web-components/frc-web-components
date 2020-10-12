import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class DigitalIO extends Webbit {

  static get metadata() {
    return {
      displayName: 'DIO',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      resizable: { },
    };
  }

  static get properties() {
    return {
      ...super.properties,
      value: { type: Boolean },
      input: { type: Boolean },
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          padding: 0;
          margin: 5px;
          height: auto;
          width: auto;
          font-family: sans-serif;
        }

        button {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: red;
        }

        button:focus {
          outline: 0;
        }

        :host([value]) button {
          background: green;
        }
      `
    ];
  }

  constructor() {
    super();
    this.value = false;
    this.input = true;
  }

  onClick() {
    this.value = !this.value;
  }

  render() {
    return html`
      <button 
        @click="${this.onClick}"
        ?disabled="${!this.input}"
      ></button>
    `;
  }
}

webbitRegistry.define('frc-sim-dio', DigitalIO);