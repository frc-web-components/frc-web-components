import PropertyView from './property-view';
import { html, css } from 'lit-element';

class FunctionPropertyView extends PropertyView {

  static get styles() {
    return [
      super.styles,
      css`
        vaadin-form-item {
          align-items: self-start;
        }
      `
    ]
  }

  constructor() {
    super();
    this.onEditTimeoutId = null;
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('inputValue')) {
      const currentContent = this.inputElement.value;
      if (currentContent !== this.inputValue) {
        this.inputElement.value = this.inputValue;
      }
    }
  }

  onInputChange() {
    if (this.onEditTimeoutId) {
      clearTimeout(this.onEditTimeoutId);
      this.onEditTimeoutId = null;
    }

    this.onEditTimeoutId = setTimeout(() => {
      this.inputValue = this.inputElement.value;
      this.dispatchPropertyChangeEvent();
    }, 500);
  }

  renderInputField() {
    return html`
      <juicy-ace-editor
        part="input"
        @change="${this.onInputChange}"
        mode="ace/mode/javascript"
        theme="ace/theme/monokai"
      ></juicy-ace-editor>
    `;
  }
}

customElements.define('dashboard-function-property-view', FunctionPropertyView);