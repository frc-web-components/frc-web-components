import { html } from 'lit-element';
import { Webbit, define } from '../../webbit';
import { containerStyles } from '../styles';

class Checkbox extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Checkbox',
      category: 'Forms & Inputs',
      description: 'A checkbox',
      documentationLink: 'https://frc-web-components.github.io/components/checkbox/',
      slots: [],
      editorTabs: ['properties', 'sources'],
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
      checked: { type: Boolean, defaultValue: false, primary: true },
      value: { type: String, defaultValue: '' },
      disabled: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: 'label' },
    };
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

define('frc-checkbox', Checkbox);