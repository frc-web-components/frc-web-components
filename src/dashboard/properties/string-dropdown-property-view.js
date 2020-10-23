import PropertyView from './property-view';
import { html } from 'lit-element';

class StringDropdownPropertyView extends PropertyView {

  renderInputField() {
    return html`
      <vaadin-combo-box 
        part="input"
        .items="${this.property.getOptions()}" 
        value="${this.inputValue || ''}"
        @input="${this.onInputChange}"
        @change="${this.onInputChange}"
        theme="small"
        ?clear-button-visible="${this.clearButtonVisible}"
        allow-custom-value
      >
      </vaadin-combo-box>
    `;
  }
}

customElements.define('dashboard-string-dropdown-property-view', StringDropdownPropertyView);