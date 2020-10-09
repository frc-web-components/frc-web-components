
import PropertyView from './property-view';
import 'multiselect-combo-box/multiselect-combo-box.js';
import { html } from 'lit-element';

const items = [
  { value: 'true', autocomplete: 'true', display: 'true' },
  { value: 'false', autocomplete: 'false', display: 'false' },
];

class BooleanArrayPropertyView extends PropertyView {

  constructor() {
    super();
    this.customValues = [];
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

  onInputChange(ev) {
    const inputElement = this.shadowRoot.querySelector('[part=input]');
    this.inputValue = inputElement.selectedItems.map(item => {
      return item.value.startsWith('true');
    });
    this.dispatchPropertyChangeEvent();
  }

  update(changedProps) {
    super.update(changedProps);

    if (changedProps.has('inputValue')) {
      const inputElement = this.shadowRoot.querySelector('[part=input]');
      inputElement.selectedItems = this.inputValue.map((value, index) => {
        return value
          ? { value: `true${index.toString()}`, autocomplete: 'true', display: 'true'}
          : { value: `false${index.toString()}`, autocomplete: 'false', display: 'false'}
      });
    }
  }

  renderInputField() {
    return html`
      <multiselect-combo-box
        part="input"
        theme="small"
        @change="${this.onInputChange}"
        .items="${items}"
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

customElements.define('dashboard-boolean-array-property-view', BooleanArrayPropertyView);