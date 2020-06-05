import PropertyView from './property-view';

class StringPropertyView extends PropertyView {

  renderInputField() {
    return html`
      <vaadin-text-field
        part="input"
        value="${this.inputValue || ''}"
        @change="${this.onInputChange}"
        theme="small"
      ></vaadin-text-field>
    `;
  }
}

customElements.define('dashboard-string-property-view', StringPropertyView);