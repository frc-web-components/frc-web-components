import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class AnalogOutput extends Container {

  static get metadata() {
    return {
      displayName: 'Analog Output',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
    };
  }

  static get properties() {
    return {
      ...super.properties,
      voltage: { type: Number },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          user-select: none;
        }

        [part=input] {
          width: 100%;
        }
      `
    ];
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.height = 'auto';
    this.width = '150px';
    this.fontFamily = 'sans-serif';
    this.voltage = 0;
  }

  render() {
    return html`
      <vaadin-number-field
        part="input"
        theme="small"
        value="${this.voltage}"
        readonly 
      ></vaadin-number-field>
    `;
  }
}

webbitRegistry.define('frc-sim-analog-output', AnalogOutput);