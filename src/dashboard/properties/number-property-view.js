import PropertyView from './property-view';

class NumberPropertyView extends PropertyView {

  onInputChange() {
    this.inputValue = parseFloat(this.inputElement.value);
    this.dispatchPropertyChangeEvent();
  }

  renderInputField() {
    return html`
      <vaadin-number-field
        part="input"
        value="${this.inputValue || ''}"
        @change="${this.onInputChange}"
        theme="small"
        has-controls
      ></vaadin-number-field>
    `;
  }
}

customElements.define('dashboard-number-property-view', NumberPropertyView);