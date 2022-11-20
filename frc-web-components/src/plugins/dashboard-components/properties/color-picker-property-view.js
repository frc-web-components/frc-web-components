import PropertyView from './property-view';
import { html } from 'lit';

class ColorPickerPropertyView extends PropertyView {
  onInputChange() {
    this.setValue(this.inputElement.value);
  }

  renderInputField() {
    return html`
      <input
        part="input"
        type="color"
        .value="${this.getValue()}"
        @change="${this.onInputChange}"
        ?disabled="${this.isDisabled()}"
        theme="small"
      />
    `;
  }
}

customElements.define(
  'dashboard-color-picker-property-view',
  ColorPickerPropertyView
);
