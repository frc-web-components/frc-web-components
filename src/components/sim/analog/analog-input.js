import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class AnalogInput extends Container {

  static get metadata() {
    return {
      displayName: 'Analog Input',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
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
      super.styles,
      css`
        :host {
          user-select: none;
        }

        [part=bar] {
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

webbitRegistry.define('frc-analog-input', AnalogInput);