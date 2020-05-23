import { Webbit, html, css } from '@webbitjs/webbit';

class CheckboxGroup extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
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
    const styleAttributes = ['focused', 'has-label', 'has-value', 'invalid'];
    const checkboxGroup = this.shadowRoot.querySelector('[part=checkbox-group-container]');

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          const { attributeName } = mutation;
          if (styleAttributes.includes(attributeName)) {
            const value = checkboxGroup.getAttribute(attributeName);
            if (value === null) {
              this.removeAttribute(attributeName, value);
            } else {
              this.setAttribute(attributeName, value);
            }
          }
        }
      });
    });

    observer.observe(checkboxGroup, {
      attributes: true
    });

    // add elements to actual checkbox vaadin group
    const checkboxes = this.querySelectorAll('frc-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.updateComplete.then(() => {
        checkbox.style.display = 'none';
        const vaadinCheckbox = checkbox.shadowRoot.querySelector('vaadin-checkbox');
        vaadinCheckbox.innerHTML = checkbox.innerHTML;
        checkboxGroup.appendChild(vaadinCheckbox);
      });
    });
  }

  onChange(ev) {
    const target = ev.target || ev.path[0];
    this.value = target.value;
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