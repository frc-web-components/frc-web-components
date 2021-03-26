import { containerStyles } from '../styles';
import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';

class ToggleButton extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Toggle Button',
      category: 'General',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/toggle-button/',
      slots: [],
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
          margin: 0;
        }
      `
    ];
  }

  static get properties() {
    return {
      toggled: { type: Boolean, defaultValue: false, primary: true },
      label: { type: String, defaultValue: 'Button' }
    }
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

define('frc-toggle-button', ToggleButton);