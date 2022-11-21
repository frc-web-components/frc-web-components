import PropertyView from './property-view';
import { html } from 'lit';

class TextAreaPropertyView extends PropertyView {
  onInputChange() {
    this.setValue(this.inputElement.value);
  }

  renderInputField() {
    return html`
      <vaadin-text-area
        part="input"
        .value="${this.getValue() ?? ''}"
        @change="${this.onInputChange}"
        theme="small"
        ?disabled="${this.isDisabled()}"
      ></vaadin-text-area>
    `;
  }
}

customElements.define(
  'dashboard-text-area-property-view',
  TextAreaPropertyView
);
