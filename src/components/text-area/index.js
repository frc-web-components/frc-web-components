import { html, css } from '@webbitjs/webbit';
import TextField from '../text-field';

export default class TextArea extends TextField {

  static get metadata() {
    return {
      displayName: 'Textarea',
      category: 'Forms & Inputs',
      // description: 'A group of checkboxes',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
    };
  }


  render() {
    return html`   
        <vaadin-text-area 
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
        </vaadin-text-area>
    `;
  }
}

webbitRegistry.define('frc-text-area', TextArea);