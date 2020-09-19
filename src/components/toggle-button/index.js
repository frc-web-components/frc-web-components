import { html, css } from '@webbitjs/webbit';
import Container from '../container';

class ToggleButton extends Container {

  static get metadata() {
    return {
      displayName: 'Toggle Button',
      category: 'General',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/toggle-button/'
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        [part=button] {
          width: 100%;
          height: 100%;
        }
      `
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      toggled: { type: Boolean, primary: true },
    }
  }

  constructor() {
    super();
    this.width = '100px';
    this.height = '50px';
    this.toggled = false;
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
        <slot></slot>
      </vaadin-button>
    `;
  }
}

webbitRegistry.define('frc-toggle-button', ToggleButton);