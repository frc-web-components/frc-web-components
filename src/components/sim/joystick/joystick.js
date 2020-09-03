import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class Joystick extends Container {

  static get metadata() {
    return {
      displayName: 'Joystick',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
    };
  }

  static get properties() {
    return {
      ...super.properties,
      gamepad: { type: Number },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        label {
          font-size: 15px;
          text-align: right;
          white-space: nowrap;
          font-weight: normal;
        }

        [part=header] {
          display: inline-block;
          font-weight: bold;
          margin-bottom: 7px;
          color: #555;
        }

        vaadin-checkbox::part(checkbox)::after {
          border-color: black;
        }
      `
    ];
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.fontFamily = 'sans-serif';
    this.gamepad = 0;
  }

  onButtonPressChange(ev) {
    if (this.hasSource()) {
      const source = this.getSource();
      if (typeof source === 'object') {
        source.buttons = ev.detail.buttonPresses;
      }
    }
  }

  onAxesChange(ev) {
    if (this.hasSource()) {
      const source = this.getSource();
      if (typeof source === 'object') {
        source.axes = ev.detail.axes;
      }
    }
  }

  render() {
    return html`
      <frc-sim-gamepad
        source-provider="Gamepad"
        source-key="${this.gamepad.toString()}"
        @buttonPressChange="${this.onButtonPressChange}"
        @axesChange="${this.onAxesChange}"
      ></frc-sim-gamepad>
    `;
  }
}

webbitRegistry.define('frc-sim-joystick', Joystick);