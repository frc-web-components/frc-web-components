import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class Pwm extends Webbit {

  static get metadata() {
    return {
      displayName: 'PWM',
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
      init: { type: Boolean },
      speed: { type: Number },
      positive: { type: Boolean },
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

        [part=bar]::part(foreground) {
          border-radius: 0;
          background: rgba(200,0,0,.5);
        }

        :host([positive]) [part=bar]::part(foreground) {
          background: rgba(0,180,0,.8);
        }
      `
    ];
  }

  constructor() {
    super();
    this.speed = 0;
    this.positive = false;
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('speed')) {
      this.positive = this.speed >= 0;
    }
  }

  render() {
    return html`
      <frc-bar 
        value="${this.speed}"
        min="-1"
        max="1"
        center="0"
        part="bar"
      >
        ${this.speed.toFixed(4)}
      </frc-bar>
    `;
  }
}

webbitRegistry.define('frc-sim-pwm', Pwm);