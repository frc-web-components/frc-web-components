import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class Relay extends Webbit {

  static get metadata() {
    return {
      displayName: 'Relay',
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
      fwd: { type: Boolean },
      rev: { type: Boolean },
      initFwd: { type: Boolean },
      initRev: { type: Boolean },
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

        vaadin-checkbox::part(label) {
          color: black;
          margin-right: 2px;
        }

        vaadin-checkbox::part(checkbox)::after {
          border-color: black;
        }
      `
    ];
  }

  constructor() {
    super();    
    this.fwd = false;
    this.rev = false;
    this.initFwd = false;
    this.initRev = false;
  }

  render() {

    if (!this.initFwd && !this.initRev) {
      return html`</p>Relay not initialized</p>`;
    }

    return html`
      <vaadin-checkbox-group>
        ${this.initFwd ? html`
          <vaadin-checkbox disabled ?checked="${this.fwd}">fwd</vaadin-checkbox>
        ` : ''}
        ${this.initRev ? html`
          <vaadin-checkbox disabled ?checked="${this.rev}">rev</vaadin-checkbox>
        ` : ''}
      </vaadin-checkbox-group>
    `;
  }
}

webbitRegistry.define('frc-sim-relay', Relay);