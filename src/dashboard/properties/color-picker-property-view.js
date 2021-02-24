import PropertyView from './property-view';
import { html } from 'lit-element';

class ColorPickerPropertyView extends PropertyView {

  renderInputField() {
    return html`
      <input
        part="input"
        type="color"
        .value="${this.inputValue || ''}"
        @change="${this.onInputChange}"
        ?disabled="${this.isDisabled()}"
        theme="small"
      />
    `;
  }
}

customElements.define('dashboard-color-picker-property-view', ColorPickerPropertyView);