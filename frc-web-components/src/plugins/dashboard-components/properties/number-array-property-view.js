import PropertyView from './property-view';
import { html } from 'lit';

class NumberArrayPropertyView extends PropertyView {
  getValue() {
    return super.getValue() ?? [];
  }

  update(changedProps) {
    super.update(changedProps);
    this.inputElement.selectedItems = this.getValue().map((value, index) => {
      return {
        value: index.toString(),
        autocomplete: value,
        display: value,
      };
    });
  }

  onInputChange() {
    this.setValue(
      this.inputElement.selectedItems.map((item) => {
        return parseFloat(item.display);
      })
    );
  }

  onCustomValueSet(ev) {
    const value = parseFloat(ev.detail);
    if (!isNaN(value)) {
      this.setValue(this.getValue().concat(value));
      this.requestUpdate();
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
  'dashboard-number-array-property-view',
  NumberArrayPropertyView
);
