import { Webbit, html, css } from '@webbitjs/webbit';

class ComboBox extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      name: { type: String },
      selected: { type: String, primary: true },
      default: { type: String },
      options: { type: Array },
      placeholder: { type: String },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      clearButtonVisible: { type: Boolean, attribute: 'clear-button-visible' },
      theme: { type: String },
      required: { type: Boolean },
      errorMessage: { type: String, attribute: 'error-message' },
      allowCustomValue: { type: Boolean, attribute: 'allow-custom-value' }
    };
  }

  constructor() {
    super();
    this.options = [];
    this.selected = '';
    this.name = '';
    this.default = '';
    this.placeholder = '';
    this.disabled = false;
    this.readonly = false;
    this.clearButtonVisible = false;
    this.theme = '';
    this.required = false;
    this.errorMessage = '';
    this.allowCustomValue = false;
  }

  firstUpdated() {
    const styleAttributes = ['opened', 'has-value', 'invalid', 'focused', 'focus-ring', 'loading'];
    const input = this.shadowRoot.querySelector('[part="combo-box"]');

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
    const element = ev.target || ev.path[0];
    this.selected = element.value;
  }

  render() {
    return html`
      <vaadin-combo-box 
        part="combo-box"
        exportparts="text-field, label, input-field, value, error-message, toggle-button"
        label="${this.name}" 
        .items="${this.options}" 
        .value="${this.selected || this.default}"
        @change="${this.onChange}"
        placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        ?clear-button-visible="${this.clearButtonVisible}"
        theme="${this.theme}"
        ?required="${this.required}"
        error-message="${this.errorMessage}"
        .allowCustomValue="${this.allowCustomValue}"
      >
      </vaadin-combo-box>
    `;
  }
}

webbitRegistry.define('frc-combo-box', ComboBox);
