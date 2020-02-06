import { Webbit, html, css } from '@webbitjs/webbit';

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
      toggled: { type: Boolean, reflect: true, primary: true },
      theme: { type: String }
    }
  }

  constructor() {
    super();
    this.toggled = false;
    this.theme = 'contrast';
  }

  onClick() {
    this.toggled = !this.toggled;
  }

  render() {
    return html`   
      <vaadin-button 
        theme="${this.theme} ${this.toggled == true ? 'primary' : ''}"
        part="button"
        @click="${this.onClick}"
      >
        <slot></slot>
      </vaadin-button>
    `;
  }
}

webbitRegistry.define('frc-toggle-button', ToggleButton);