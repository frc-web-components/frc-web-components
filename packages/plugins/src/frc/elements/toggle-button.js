import { html, css, LitElement } from 'lit';
import { containerStyles } from '../styles';

export const elementName = 'frc-toggle-button';

export const elementConfig = {
  dashboard: {
    displayName: 'Toggle Button',
  },
  properties: {
    toggled: { type: Boolean, defaultValue: false, primary: true, changeEvent: 'toggle' },
    label: { type: String, defaultValue: 'Button' }
  }
};

class ToggleButton extends LitElement {

  static styles = [
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

  static properties = elementConfig.properties;

  constructor() {
    super();
    this.toggled = false;
    this.label = 'Button';
  }

  onClick() {
    this.toggled = !this.toggled;
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { 
        toggled: this.toggled
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`   
      <vaadin-button theme="${this.toggled == true ? 'primary' : ''} contrast" part="button" @click="${this.onClick}">
        ${this.label}
      </vaadin-button>
    `;
  }
}

customElements.define(elementName, ToggleButton);
