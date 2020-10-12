import { Webbit, html } from '@webbitjs/webbit';
import { containerStyles } from '../styles';

class CheckboxGroup extends Webbit {

  static get metadata() {
    return {
      displayName: 'Checkbox Group',
      category: 'Forms & Inputs',
      description: 'A group of checkboxes',
      documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      allowedChildren: ['frc-checkbox'],
      resizable: { left: true, right: true },
      layout: 'none',
      dashboardHtml: `
        <frc-checkbox-group>
          <frc-checkbox value="checkbox1" label="Checkbox 1"></frc-checkbox>
          <frc-checkbox value="checkbox2" label="Checkbox 2"></frc-checkbox>
        </frc-checkbox-group>
      `
    };
  }

  static get styles() {
    return [
      containerStyles
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      value: { type: Array, primary: true },
      label: { type: String },
      theme: { type: String },
      disabled: { type: Boolean },
      required: { type: Boolean },
      errorMessage: { type: String, attribute: 'error-message' },
      
    };
  }

  constructor() {
    super();
    this.value = [];
    this.label = '';
    this.theme = 'vertical';
    this.disabled = false;
    this.required = false;
    this.errorMessage = '';
  }

  firstUpdated() {
    super.firstUpdated();
    const styleAttributes = ['focused', 'has-label', 'has-value', 'invalid'];
    this.checkboxGroup = this.shadowRoot.querySelector('[part=checkbox-group-container]');

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          const { attributeName } = mutation;
          if (styleAttributes.includes(attributeName)) {
            const value = this.checkboxGroup.getAttribute(attributeName);
            if (value === null) {
              this.removeAttribute(attributeName, value);
            } else {
              this.setAttribute(attributeName, value);
            }
          }
        } else if (mutation.type === 'childList') {
          // add elements to actual checkbox vaadin group
          this.checkboxGroup.innerHtml = '';
          const checkboxes = this.querySelectorAll('frc-checkbox');
          checkboxes.forEach(checkbox => {
            checkbox.updateComplete.then(() => {
              checkbox.style.display = 'none';
              const vaadinCheckbox = checkbox.shadowRoot.querySelector('vaadin-checkbox');
              vaadinCheckbox.innerHTML = checkbox.label;
              this.checkboxGroup.appendChild(vaadinCheckbox);
            });
          });
        }
      });
    });

    observer.observe(this.checkboxGroup, {
      attributes: true,
      childList: true
    });
  }

  onChange(ev) {
    const target = ev.target || ev.path[0];
    this.value = target.value;
  }

  getAllValues() {
    return this.checkboxGroup._checkboxes.map(checkbox => checkbox.value);
  }

  render() {
    return html`   
      <vaadin-checkbox-group
        part="checkbox-group-container"
        exportparts="label, group-field, error-message"
        .value="${this.value || []}" 
        label="${this.label}"
        theme="${this.theme}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        error-message="${this.errorMessage}"
        @value-changed="${this.onChange}"
      >
        <slot></slot>
      </vaadin-checkbox-group>
    `;
  }
}

webbitRegistry.define('frc-checkbox-group', CheckboxGroup);