import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class ToggleButton extends Webbit {

  static get metadata() {
    return {
      displayName: 'Toggle Button',
      category: 'General',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/toggle-button/',
      slots: []
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          width: 100px;
          height: 50px;
        }

        [part=button] {
          width: 100%;
          height: 100%;
        }
      `
    ];
  }

  static get properties() {
    return {
      toggled: { type: Boolean, primary: true },
      label: { type: String }
    }
  }

  constructor() {
    super();
    this.toggled = false;
    this.label = 'Button';
  }

  onClick() {
    this.toggled = !this.toggled;
  }

  render() {
    return html`   
      <vaadin-button 
        theme="${this.toggled == true ? 'primary' : ''} contrast"
        part="button"
        @click="${this.onClick}"
      >
        ${this.label}
      </vaadin-button>
    `;
  }
}

webbitRegistry.define('frc-toggle-button', ToggleButton);