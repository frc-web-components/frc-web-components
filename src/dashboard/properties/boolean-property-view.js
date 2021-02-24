import PropertyView from './property-view';
import { html } from 'lit-element';

class BooleanPropertyView extends PropertyView {

  onInputChange() {
    this.inputValue = this.inputElement.checked;
    this.dispatchPropertyChangeEvent();
  }

  renderInputField() {
    return html`
      <vaadin-checkbox
        part="input"
        ?checked="${this.inputValue}"
        @change="${this.onInputChange}"
        ?disabled="${this.isDisabled()}"
        theme="small"
      ></vaadin-checkbox>
    `;
  }
}

customElements.define('dashboard-boolean-property-view', BooleanPropertyView);