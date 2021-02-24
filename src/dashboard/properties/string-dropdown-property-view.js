import PropertyView from './property-view';
import { html } from 'lit-element';

class StringDropdownPropertyView extends PropertyView {

  allowCustomValues() { 
    return 'allowCustomValues' in this.property
      ? this.property.allowCustomValues
      : true;
  }

  renderInputField() {

    return html`
      <vaadin-combo-box 
        part="input"
        .items="${this.property.getOptions.bind(this.selectedNode.getNode())()}" 
        value="${this.inputValue || ''}"
        @change="${this.onInputChange}"
        theme="small"
        ?clear-button-visible="${this.clearButtonVisible}"
        ?disabled="${this.isDisabled()}"
        ?allow-custom-value="${this.allowCustomValues()}"
      >
      </vaadin-combo-box>
    `;
  }
}

customElements.define('dashboard-string-dropdown-property-view', StringDropdownPropertyView);