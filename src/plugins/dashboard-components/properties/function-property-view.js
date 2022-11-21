import PropertyView from './property-view';
import { html, css } from 'lit';

class FunctionPropertyView extends PropertyView {
  static get styles() {
    return [
      super.styles,
      css`
        vaadin-form-item {
          align-items: self-start;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      inputValue: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.onEditTimeoutId = null;
    this.inputValue = '';
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('element') || changedProps.has('connector')) {
      this.inputValue = this.getValue() ?? '';
    }

    if (changedProps.has('inputValue')) {
      const currentContent = this.inputElement.value;
      if (currentContent !== this.inputValue) {
        this.inputElement.value = this.inputValue;
      }
      this.setValue(this.inputValue);
    }
  }

  propertyChanged(value) {
    this.inputElement.value = value;
  }

  onInputChange() {
    if (this.onEditTimeoutId) {
      clearTimeout(this.onEditTimeoutId);
      this.onEditTimeoutId = null;
    }

    this.onEditTimeoutId = setTimeout(() => {
      this.inputValue = this.inputElement.value;
    }, 500);
  }

  renderInputField() {
    return html`
      <juicy-ace-editor
        part="input"
        @change="${this.onInputChange}"
        mode="ace/mode/javascript"
        theme="ace/theme/monokai"
        ?disabled="${this.isDisabled()}"
      ></juicy-ace-editor>
    `;
  }
}

customElements.define('dashboard-function-property-view', FunctionPropertyView);
