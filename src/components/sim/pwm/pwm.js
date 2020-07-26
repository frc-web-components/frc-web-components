import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class Pwm extends Container {

  static get metadata() {
    return {
      displayName: 'PWM',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
    };
  }

  static get properties() {
    return {
      ...super.properties,
      init: { type: Boolean },
      speed: { type: Number },
      positive: { type: Boolean },
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
    this.display = 'inline-block';
    this.height = 'auto';
    this.width = '150px';
    this.fontFamily = 'sans-serif';
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