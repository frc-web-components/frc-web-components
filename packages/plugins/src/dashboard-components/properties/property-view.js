import { LitElement, html, css } from 'lit';

export default class PropertyView extends LitElement {

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }
    vaadin-form-item {
      width: 100%;
      --vaadin-form-item-label-width: 10em;
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

    label > span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
    }
  `;

  static properties = {
    element: { type: HTMLElement, attribute: false },
    propertyHandler: { type: Object, attribute: false },
    propertyName: { type: String },
  };

  constructor() {
    super();
    this.element = null;
    this.propertyHandler = null;
    this.propertyName = null;
  }
  
  get inputElement() {
    return this.renderRoot.querySelector('[part="input"]');
  }

  get property() {
    return this.propertyHandler.getProperty();
  }

  getValue() {
    return this.propertyHandler.getStoredValue();
  }

  setValue(value) {
    this.propertyHandler.setStoredValue(value);
    this.#dispatchChange();
  }

  setToDefault() {
    const defaultValue = this.propertyHandler.getProperty().defaultValue;
    this.setValue(defaultValue);
  }

  isDisabled() {
    const isDisabled = this.property?.input?.isDisabled;
    if (typeof isDisabled !== 'function') {
      return false;
    }
    return isDisabled(this.element);
  }

  renderInputField() {
    return html``;
  }

  propertyChanged(value) {
    
  }

  #dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.getValue(), name: this.propertyName },
      bubbles: true,
      composed: true
    }));
  }

  updated(changedProps) {
    if (changedProps.has('propertyHandler') && this.propertyHandler) {
      this.propertyHandler.subscribe(value => {
        this.propertyChanged(value);
        this.#dispatchChange();
      }, true);
    }
  }

  render() {
    return html`
      <vaadin-form-item>
        <label slot="label" title=${this.propertyName}>
          <span>${this.propertyName}</span>
        </label>
        ${this.renderInputField()}
      </vaadin-form-item>
    `;
  }
}