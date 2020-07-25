import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class DigitalIO extends Container {

  static get metadata() {
    return {
      displayName: 'DIO',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
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
      super.styles,
      css`
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
    this.display = 'inline-block';
    this.padding = '0';
    this.margin = '5px';
    this.height = 'auto';
    this.width = 'auto';
    this.fontFamily = 'sans-serif';
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