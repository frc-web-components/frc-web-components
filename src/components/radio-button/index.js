import { html, css } from 'lit-element';
import { define, Webbit } from '../../webbit';

class RadioButton extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Radio Button',
      category: 'Forms & Inputs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      resizable: {},
      dashboardHtml: `
        <frc-radio-button label="label"></frc-radio-button>
      `
    };
  }


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
      disabled: { type: Boolean },
      label: { type: String }
    };
  }

  firstUpdated() {
    const styleAttributes = ['focus-ring', 'focused', 'empty'];
    const input = this.shadowRoot.querySelector('[part=radio-button-container]');

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
      <vaadin-radio-button
        part="radio-button-container"
        exportparts="radio, label"
        value="${this.value}" 
        ?checked="${this.checked}" 
        ?disabled="${this.disabled}"
        @checked-changed="${this.onChange}"
      >
        ${this.label}
      </vaadin-radio-button>
    `;
  }
}

define('frc-radio-button', RadioButton);