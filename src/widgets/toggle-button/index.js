import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';

class ToggleButton extends Widget {

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


registerWidget('toggle-button', {
  class: ToggleButton,
  label: 'Toggle Button',
  category: 'FRC',
  image: require.resolve('./toggle-button.png')
});