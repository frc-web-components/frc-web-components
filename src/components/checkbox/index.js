import { html } from '@webbitjs/webbit';
import Container from '../container';

class Checkbox extends Container {

  static get metadata() {
    return {
      displayName: 'Checkbox',
      category: 'Forms & Inputs',
      description: 'A checkbox',
      documentationLink: 'https://frc-web-components.github.io/components/checkbox/',
      slots: []
    };
  }

  static get styles() {
    return [
      super.styles,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
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
    super.firstUpdated();
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