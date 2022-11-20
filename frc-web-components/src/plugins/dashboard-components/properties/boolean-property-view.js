import PropertyView from './property-view';
import { html } from 'lit';

class BooleanPropertyView extends PropertyView {
  onInputChange() {
    this.setValue(this.inputElement.checked);
  }

  renderInputField() {
    return html`
      <vaadin-checkbox
        part="input"
        ?checked="${this.getValue()}"
        @change="${this.onInputChange}"
        ?disabled="${this.isDisabled()}"
        theme="small"
      ></vaadin-checkbox>
    `;
  }
}

customElements.define('dashboard-boolean-property-view', BooleanPropertyView);
