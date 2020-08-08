import { LitElement, html, css } from 'lit-element';

export default class PropertyView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
      }

      vaadin-form-item {
        width: 100%;
      }

      vaadin-form-item label {
        text-transform: capitalize;
      }

      vaadin-text-field, vaadin-number-field, multiselect-combo-box {
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      selectedNode: { type: Object, attribute: false },
      propertyName: { type: String, attribute: false },
      property: { type: Object, attribute: false },
      inputValue: { type: Object },
    };
  }

  constructor() {
    super();
    this.selectedNode = null;
    this.propertyName = '';
    this.property = null;
    this.inputValue = null;
    this.inputElement = null;
  }

  getValue() {
    return this.selectedNode.getDefaultProps()[this.propertyName];
  }

  isInputModified() {
    return this.getValue() !== this.inputValue || this.inputValue === null;
  }

  isValid() {
    return true;
  }
  

  onInputChange() {
    this.inputValue = this.inputElement.value;
    this.dispatchPropertyChangeEvent();
  }

  cancel() {
    this.inputValue = this.getValue();
  }

  getPropertyNameValuePair() {
    return [this.propertyName, this.inputValue];
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode') && this.selectedNode) {
      this.inputValue = this.getValue();
    }
  }

  dispatchPropertyChangeEvent() {
    const event = new CustomEvent('dashboardToolsViewPropertyChange', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  firstUpdated() {
    this.inputElement = this.shadowRoot.querySelector('[part="input"]');
    this.dispatchPropertyChangeEvent();
  }

  renderInputField() {
    return html``;
  }

  render() {
    return html`
      <vaadin-form-item>
        <label slot="label">${this.property.attribute.replace(/-/g, ' ')}</label>
        ${this.renderInputField()}
      </vaadin-form-item>
    `;
  }
}
