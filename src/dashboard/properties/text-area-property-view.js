import PropertyView from './property-view';
import { html } from 'lit-element';

class TextAreaPropertyView extends PropertyView {

  renderInputField() {
    return html`
      <vaadin-text-area
        part="input"
        value="${this.inputValue || ''}"
        @input="${this.onInputChange}"
        @change="${this.onInputChange}"
        theme="small"
        ?disabled="${this.isDisabled()}"
      ></vaadin-text-area>
    `;
  }
}

customElements.define('dashboard-text-area-property-view', TextAreaPropertyView);