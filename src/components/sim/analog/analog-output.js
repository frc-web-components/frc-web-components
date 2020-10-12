import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class AnalogOutput extends Webbit {

  static get metadata() {
    return {
      displayName: 'Analog Output',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      resizable: { left: true, right: true },
      minSize: { width: 50 }
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
      containerStyles,
      css`
        :host {
          user-select: none;
          display: inline-block;
          height: auto;
          width: 150px;
          font-family: sans-serif;
        }

        [part=input] {
          width: 100%;
        }
      `
    ];
  }

  constructor() {
    super();
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