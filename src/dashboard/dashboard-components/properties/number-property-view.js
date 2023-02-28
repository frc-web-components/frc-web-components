import PropertyView from './property-view';
import { html } from 'lit';

class NumberPropertyView extends PropertyView {
  onInputChange() {
    const numberValue = parseFloat(this.inputElement.value);
    if (isNaN(numberValue)) {
      this.setToDefault();
    } else {
      this.setValue(numberValue);
    }
  }

  renderInputField() {
    return html`
      <vaadin-number-field
        part="input"
        value="${this.getValue()}"
        @change="${this.onInputChange}"
        ?disabled="${this.isDisabled()}"
        theme="small"
        has-controls
        .min=${this.property?.input?.min}
        .max=${this.property?.input?.max}
      >
        <div slot="prefix">${this.property?.input?.prefix ?? ''}</div>
        <div slot="suffix">${this.property?.input?.suffix ?? ''}</div>
      </vaadin-number-field>
    `;
  }
}

customElements.define('dashboard-number-property-view', NumberPropertyView);
