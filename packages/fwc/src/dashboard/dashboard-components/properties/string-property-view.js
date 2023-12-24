import PropertyView from './property-view';
import { html } from 'lit';

class StringPropertyView extends PropertyView {
  onInputChange() {
    this.setValue(this.inputElement.value);
  }

  renderInputField() {
    return html`
      <vaadin-text-field
        part="input"
        .value=${this.getValue() ?? ''}
        @change="${this.onInputChange}"
        theme="small"
        ?disabled="${this.isDisabled()}"
      ></vaadin-text-field>
    `;
  }
}

customElements.define('dashboard-string-property-view', StringPropertyView);
