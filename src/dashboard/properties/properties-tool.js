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
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedNode = null;
  }

  isInputModified() {
    const propertiesViewElement = this.shadowRoot.querySelector('[part="properties-view"]');
    return (
      (propertiesViewElement ? propertiesViewElement.isInputModified() : false)
    );
  }

  onCancel() {
    const propertiesViewElement = this.shadowRoot.querySelector('[part="properties-view"]');
    propertiesViewElement.cancel();
    this.requestUpdate();
  }

  onConfirm() {

    const propertiesViewElement = this.shadowRoot.querySelector('[part="properties-view"]');

    if (propertiesViewElement.isValid()) {
      this.wom.executeAction('setProperties', { 
        propertyValueMap: propertiesViewElement.getPropertyValueMap(), 
      });
      this.requestUpdate();
    }
  }

  onPropertiesChange() {
    this.requestUpdate();
  }

  renderWebbit() {
    return html`
      <p>Properties for <span>${this.selectedNode.getWebbitName() || this.selectedNode.getName()}</span></p>
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