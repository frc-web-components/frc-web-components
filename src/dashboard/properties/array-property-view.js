
import PropertyView from './property-view';
import 'multiselect-combo-box/multiselect-combo-box.js';
import { html } from 'lit-element';

class ArrayPropertyView extends PropertyView {

  constructor() {
    super();
    this.customValues = [];
    this.inputValue = [];
  }

  isInputModified() {

    const value = this.getValue();

    if (value.length !== this.inputValue.length) {
      return true;
    }

    for (let i = 0; i < value.length; i++) {
      if (value[i] !== this.inputValue[i]) {
        return true;
      }
    }

    return false;
  }

  onInputChange() {
    this.inputValue = this.inputElement.selectedItems;
    this.dispatchPropertyChangeEvent();
  }

  onCustomValueSet(ev) {
    this.customValues.push(ev.detail);
    this.inputValue = this.inputValue.concat(ev.detail);
    this.requestUpdate();
  }

  getAllValues() {
    return this.selectedNode.getNode().getAllValues().concat(this.customValues);
  }

  renderInputField() {
    return html`
      <multiselect-combo-box
        part="input"
        theme="small"
        allow-custom-values
        @change="${this.onInputChange}"
        @custom-values-set="${this.onCustomValueSet}"
        .items="${this.getAllValues()}"
        .selectedItems="${this.inputValue || []}"
      >
      </multiselect-combo-box>
    `;
  }
}

customElements.define('dashboard-array-property-view', ArrayPropertyView);