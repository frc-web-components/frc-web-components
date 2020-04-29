import { Webbit, html, css } from '@webbitjs/webbit';

class Checkbox extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
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

  onChange(ev) {
    const [target] = ev.path;
    this.checked = target.checked;
  }

  render() {
    return html`   
      <vaadin-checkbox 
        value="Option" 
        ?checked="${this.checked}" 
        ?disabled="${this.disabled}"
        @change="${this.onChange}"
      >
        <slot></slot>
      </vaadin-checkbox>
    `;
  }
}

webbitRegistry.define('frc-checkbox', Checkbox);