import { Webbit, html, css } from '@webbitjs/webbit';

export default class TextField extends Webbit {

  static get metadata() {
    return {
      displayName: 'Text Field',
      category: 'Forms & Inputs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      resizable: { left: true, right: true },
    };
  }


  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      [part=input] {
        max-height: inherit;
        min-height: inherit;
        height: inherit;
        width: inherit;
        max-width: inherit;
        min-width: inherit;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: String, primary: true },
      label: { type: String },
      placeholder: { type: String },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      autoselect: { type: Boolean },
      clearButtonVisible: { type: Boolean, attribute: 'clear-button-visible' },
      required: { type: Boolean },
      minlength: { type: Number },
      maxlength: { type: Number },
      errorMessage: { type: String, attribute: 'error-message' },
      pattern: { type: String },
      preventInvalidInput: { type: Boolean, attribute: 'prevent-invalid-input' },
      theme: { type: String }
    };
  }

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.placeholder = '';
    this.disabled = false;
    this.readonly = false;
    this.autoselect = false;
    this.clearButtonVisible = false;
    this.required = false;
    this.minlength = 0;
    this.maxlength = Infinity;
    this.errorMessage = '';
    this.pattern = '';
    this.preventInvalidInput = false;
    this.theme = '';
  }

  firstUpdated() {
    super.firstUpdated();
    const styleAttributes = ['has-value', 'has-label', 'invalid', 'input-prevented', 'focused', 'focus-ring'];
    const input = this.shadowRoot.querySelector('[part=input]');

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
    const input = ev.target || ev.path[0];
    this.value = input.value;
  }

  render() {
    return html`   
        <vaadin-text-field 
          part="input"
          exportparts="label, input-field, value, error-message"
          value="${this.value}"
          label="${this.label}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readonly}"
          ?autoselect="${this.autoselect}"
          ?clear-button-visible="${this.clearButtonVisible}"
          ?required="${this.required}"
          minlength="${this.minlength}"
          maxlength="${this.maxlength}"
          error-message="${this.errorMessage}"
          pattern="${this.pattern}"
          ?prevent-invalid-input="${this.preventInvalidInput}"
          theme="${this.theme}"
          @change="${this.onChange}"
        >
          <span slot="prefix"><slot name="prefix"></slot></span>
          <span slot="suffix"><slot name="suffix"></slot></span>
        </vaadin-text-field>
    `;
  }
}

webbitRegistry.define('frc-text-field', TextField);