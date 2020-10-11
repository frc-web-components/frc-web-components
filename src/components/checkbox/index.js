import { Webbit, html } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class Checkbox extends Webbit {

  static get metadata() {
    return {
      displayName: 'Checkbox',
      category: 'Forms & Inputs',
      description: 'A checkbox',
      documentationLink: 'https://frc-web-components.github.io/components/checkbox/',
      slots: [],
      resizable: {}
    };
  }

  static get styles() {
    return [
      containerStyles,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      checked: { type: Boolean, primary: true },
      value: { type: String },
      disabled: { type: Boolean },
      label: { type: String },
    };
  }

  constructor() {
    super();
    this.checked = false;
    this.value = '';
    this.disabled = false;
    this.label = 'label';
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
        ${this.label}
      </vaadin-checkbox>
    `;
  }
}

webbitRegistry.define('frc-checkbox', Checkbox);