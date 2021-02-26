import { LitElement, html, css } from 'lit-element';
import './properties-view';

class PropertiesTool extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
      }

      [part=main-fields] {
        display: flex;
      }

      [part=main-fields] vaadin-text-field {
        flex: 1;
        margin-right: 7px;
        min-width: 120px;
        padding-top: 0;
      }

      [part=buttons] {
        display: flex;
        justify-content: flex-end;
      }

      [part=buttons] vaadin-button {
        margin-right: 7px;
      }

      p {
        margin-top: 0;
        font-weight: bold;
      }

      p span {
        color: purple;
      }

    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      selectedNode: { type: Object, attribute: false },
      webbitNameInput: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedNode = null;
    this.webbitNameInput = '';
  }

  getComponentName() {
    return this.selectedNode.getName();
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode') && this.selectedNode) {
      this.webbitNameInput = this.getWebbitName();
    }
  }

  getWebbitName() {
    return this.selectedNode.getWebbitName();
  }

  isWebbitNameInputModified() {
    if (!this.selectedNode) {
      return false;
    }

    return this.getWebbitName() !== this.webbitNameInput || this.webbitNameInput === null;
  }

  isInputModified() {
    const propertiesViewElement = this.shadowRoot.querySelector('[part="properties-view"]');
    return (
      this.isWebbitNameInputModified() || 
      (propertiesViewElement ? propertiesViewElement.isInputModified() : false)
    );
  }

  onWebbitNameInputChange(ev) {
    const input = ev.target || ev.path[0];
    this.webbitNameInput = input.value;
  }

  onCancel() {
    const propertiesViewElement = this.shadowRoot.querySelector('[part="properties-view"]');
    this.webbitNameInput = this.getWebbitName();
    propertiesViewElement.cancel();
    this.requestUpdate();
  }

  onConfirm() {

    const propertiesViewElement = this.shadowRoot.querySelector('[part="properties-view"]');
    const webbitNameNode = this.shadowRoot.querySelector('[part="webbit-name"]');

    if (!webbitNameNode.invalid && propertiesViewElement.isValid()) {
      this.wom.executeAction('setProperties', { 
        propertyValueMap: propertiesViewElement.getPropertyValueMap(), 
        webbitName: this.webbitNameInput
      });
      this.requestUpdate();
    }
  }

  onPropertiesChange() {
    this.requestUpdate();
  }

  renderWebbit() {
    return html`
      <p>Properties for <span>${this.selectedNode.getWebbitName() || this.selectedNode.getDisplayName()}</span></p>
      <div part="main-fields">
        <vaadin-text-field
          label="Element Name"
          part="webbit-name"
          clear-button-visible
          value="${this.webbitNameInput || ''}"
          @input="${this.onWebbitNameInputChange}"
          @change="${this.onWebbitNameInputChange}"
          theme="small"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Component Type"
          readonly
          value="${this.getComponentName()}"
          theme="small"
        ></vaadin-text-field>
      </div>

      <dashboard-properties-view
        part="properties-view"
        .wom="${this.wom}"
        .selectedNode="${this.selectedNode}"
        @dashboardToolsViewPropertyChange="${this.onPropertiesChange}"
      ></dashboard-properties-view>

      <div part="buttons">
        <vaadin-button 
          part="confirm-button" 
          theme="success primary small" 
          aria-label="Confirm"
          ?disabled="${!this.isInputModified()}"
          @click="${this.onConfirm}"
        >
          Confirm
        </vaadin-button>

        <vaadin-button 
          part="cancel-button" 
          theme="error primary small" 
          aria-label="Cancel"
          ?disabled="${!this.isInputModified()}"
          @click="${this.onCancel}"
        >
          Cancel
        </vaadin-button>
      </div>
    `;
  }


  render() {

    if (!this.selectedNode) {
      return html`<p>Select an element to view its properties.</p>`;
    }

    if (this.selectedNode === this.wom.getRootNode()) {
      return html`<p>The properties for the root node cannot be changed.</p>`;
    }

    if (this.selectedNode && !this.selectedNode.isRegistered()) {
      return html`<p>This element does not contain any properties.</p>`;
    }

    return this.renderWebbit();
  }
}

customElements.define('dashboard-properties-tool', PropertiesTool);