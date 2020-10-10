
import PropertyView from './property-view';
import 'multiselect-combo-box/multiselect-combo-box.js';
import { html } from 'lit-element';

class NumberArrayPropertyView extends PropertyView {

  constructor() {
    super();
    this.inputValue = [];
    this.id = 0;
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


  update(changedProps) {
    super.update(changedProps);

    if (changedProps.has('inputValue')) {
      const inputElement = this.shadowRoot.querySelector('[part=input]');
      inputElement.selectedItems = this.inputValue.map((value, index) => {
        return {
          value: `sodufhduisfiusfdisdfhiusdfhfidsiusdhfiu${index.toString()}`,
          autocomplete: value,
          display: value
        };
      });
    }
  }

  onInputChange(ev) {
    const inputElement = this.shadowRoot.querySelector('[part=input]');
    this.inputValue = inputElement.selectedItems.map(item => {
      return parseFloat(item.display);
    });
    this.dispatchPropertyChangeEvent();
  }

  onCustomValueSet(ev) {
    const value = parseFloat(ev.detail);
    if (!isNaN(value)) {
      this.inputValue = this.inputValue.concat(ev.detail);
      this.requestUpdate();
      this.dispatchPropertyChangeEvent();
    }
  }

  renderInputField() {
    return html`
      <multiselect-combo-box
        part="input"
        theme="small"
        allow-custom-values
        @custom-values-set="${this.onCustomValueSet}"
        @change="${this.onInputChange}"
        .items="${[]}"
        item-label-path="autocomplete" 
        item-value-path="value"
        item-id-path="value"
      >
        <template>
          [[item.display]]
        </template>
      </multiselect-combo-box>
    `;
  }
}

customElements.define('dashboard-number-array-property-view', NumberArrayPropertyView);