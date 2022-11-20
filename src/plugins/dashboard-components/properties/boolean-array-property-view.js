import PropertyView from './property-view';
import { html } from 'lit';

const items = [
  { value: 'true', autocomplete: 'true', display: 'true' },
  { value: 'false', autocomplete: 'false', display: 'false' },
];

class BooleanArrayPropertyView extends PropertyView {
  getValue() {
    return super.getValue() ?? [];
  }

  onInputChange() {
    this.setValue(
      this.inputElement.selectedItems.map((item) => {
        return item.value.startsWith('true');
      })
    );
  }

  update(changedProps) {
    super.update(changedProps);
    this.inputElement.selectedItems = this.getValue().map((value, index) => {
      return value
        ? {
            value: `true${index.toString()}`,
            autocomplete: 'true',
            display: 'true',
          }
        : {
            value: `false${index.toString()}`,
            autocomplete: 'false',
            display: 'false',
          };
    });
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
        ?disabled="${this.isDisabled()}"
      >
        <template> [[item.display]] </template>
      </multiselect-combo-box>
    `;
  }
}

customElements.define(
  'dashboard-boolean-array-property-view',
  BooleanArrayPropertyView
);
