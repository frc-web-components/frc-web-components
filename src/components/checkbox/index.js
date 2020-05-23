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
      value: { type: String },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.checked = false;
    this.value = '';
    this.disabled = false;
  }

  firstUpdated() {
    const styleAttributes = ['active', 'focus-ring', 'focused', 'indeterminate', 'empty'];
    const input = this.shadowRoot.querySelector('[part=checkbox-container]');

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          const { attributeName } = mutation;
          if (styleAttributes.includes(attributeName)) {
            const value = input.getAttribute(attributeName);
            if (value === null) {
              this.removeAttribute(attributeName, value);
            } else {
              this.setAttribute(attributeName, value);
            }
          }
        }
      });
    });

    observer.observe(input, {
      attributes: true
    });
  }

  onChange(ev) {
    const target = ev.target || ev.path[0];
    this.checked = target.checked;
  }

  render() {
    return html`   
      <vaadin-checkbox
        part="checkbox-container"
        exportparts="checkbox, label"
        value="${this.value}" 
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