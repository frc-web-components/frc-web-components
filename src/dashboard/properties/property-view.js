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

      vaadin-text-field, vaadin-number-field, multiselect-combo-box, vaadin-text-area, vaadin-combo-box {
        width: 100%;
      }

      input[type=color] {
        width: calc(100% - 5px);
        min-width: 163px;
      }

      juicy-ace-editor {
        margin-top: 12px;
        height: 300px;
      }
    `;
  }

  static get properties() {
    return {
      selectedNode: { type: Object, attribute: false },
      propertyName: { type: String, attribute: false },
      property: { type: Object, attribute: false },
      inputValue: { type: Object },
      propertyValueMap: { type: Object },
    };
  }

  constructor() {
    super();
    this.selectedNode = null;
    this.propertyName = '';
    this.property = null;
    this.inputValue = null;
    this.inputElement = null;
    this.propertyValueMap = null;
  }

  getValue() {
    console.log('default props:', this.selectedNode.getDefaultProps());
    return this.selectedNode.getDefaultProps()[this.propertyName];
  }

  isDisabled() {
    if (!this.propertyValueMap) {
      return false;
    }

    return 'isDisabled' in this.property
      ? this.property.isDisabled(this.propertyValueMap)
      : false;
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
