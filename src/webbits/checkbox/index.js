import { Webbit, html, css } from '@webbitjs/webbit';

class Checkbox extends Webbit {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
      }
    `;
  }

  static get properties() {
    return {
      checked: { type: Boolean, primary: true },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
  }

  render() {
    return html`   
      <vaadin-checkbox 
        value="Option" 
        ?checked="${this.checked}" 
        ?disabled="${this.disabled}"
      >
        <slot></slot>
      </vaadin-checkbox>
    `;
  }
}

webbitRegistry.define('frc-checkbox', Checkbox);