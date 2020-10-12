import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class Joystick extends Webbit {

  static get metadata() {
    return {
      displayName: 'Joystick',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
      resizable: { left: true, right: true },
      minSize: { width: 100 }
    };
  }

  static get properties() {
    return {
      gamepad: { type: Number },
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          font-family: sans-serif;
        }

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
    this.gamepad = 0;
  }

  onButtonPressChange(ev) {
    if (this.hasSource()) {
      const source = this.getSource();
      if (source && typeof source === 'object') {
        source.buttons = ev.detail.buttonPresses;
      }
    }
  }

  onAxesChange(ev) {
    if (this.hasSource()) {
      const source = this.getSource();
      if (source && typeof source === 'object') {
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