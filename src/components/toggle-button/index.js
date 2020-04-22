import { Webbit, html, css } from '@webbitjs/webbit';
import '@vaadin/vaadin-button';

class ToggleButton extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 100px;
        height: 50px;
      }

      [part=button] {
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      toggled: { type: Boolean, primary: true },
    }
  }

  constructor() {
    super();
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