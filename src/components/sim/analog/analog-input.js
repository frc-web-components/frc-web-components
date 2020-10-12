import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class AnalogInput extends Webbit {

  static get metadata() {
    return {
      displayName: 'Analog Input',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
      resizable: { left: true, right: true },
      minSize: { width: 50 }
    };
  }

  static get properties() {
    return {
      ...super.properties,
      init: { type: Boolean },
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

        [part=bar] {
          width: 100%;
        }
      `
    ];
  }

  constructor() {
    super();
    this.voltage = 0;
  }

  onBarDrag(ev) {
    const { value } = ev.detail;
    this.voltage = value;
  }

  render() {
    return html`
      <frc-bar 
        value="${this.voltage}"
        min="0"
        max="5"
        center="0"
        part="bar"
        @barDrag="${this.onBarDrag}"
      >
        ${this.voltage.toFixed(4)}
      </frc-bar>
    `;
  }
}

webbitRegistry.define('frc-sim-analog-input', AnalogInput);