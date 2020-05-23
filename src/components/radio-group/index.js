import { Webbit, html, css } from '@webbitjs/webbit';

class RadioGroup extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: String, primary: true },
      label: { type: String },
      theme: { type: String },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      required: { type: Boolean },
      errorMessage: { type: String, attribute: 'error-message' },
      
    };
  }

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.theme = 'vertical';
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.errorMessage = '';
  }

  firstUpdated() {
    const styleAttributes = ['focused', 'has-label', 'has-value', 'invalid'];
    const radioGroup = this.shadowRoot.querySelector('[part=radio-group-container]');

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          const { attributeName } = mutation;
          if (styleAttributes.includes(attributeName)) {
            const value = radioGroup.getAttribute(attributeName);
            if (value === null) {
              this.removeAttribute(attributeName, value);
            } else {
              this.setAttribute(attributeName, value);
            }
          }
        }
      });
    });

    observer.observe(radioGroup, {
      attributes: true
    });

    // add elements to actual radio vaadin group
    const radioButtons = this.querySelectorAll('frc-radio-button');
    radioButtons.forEach(radioButton => {
      radioButton.updateComplete.then(() => {
        radioButton.style.display = 'none';
        const vaadinRadioButton = radioButton.shadowRoot.querySelector('vaadin-radio-button');
        vaadinRadioButton.innerHTML = radioButton.innerHTML;
        radioGroup.appendChild(vaadinRadioButton);
      });
    });
  }

  onChange(ev) {
    const target = ev.target || ev.path[0];
    this.value = target.value;
  }

  render() {
    return html`   
      <vaadin-radio-group
        part="radio-group-container"
        exportparts="label, group-field, error-message"
        .value="${this.value}" 
        label="${this.label}"
        theme="${this.theme}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        error-message="${this.errorMessage}"
        @value-changed="${this.onChange}"
      >
        <slot></slot>
      </vaadin-radio-group>
    `;
  }
}

webbitRegistry.define('frc-radio-group', RadioGroup);