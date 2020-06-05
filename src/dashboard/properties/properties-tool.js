import { LitElement, html, css } from 'lit-element';

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
      selectedNode: { type: Object, attribute: false },
      webbitIdInput: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.selectedNode = null;
    this.webbitIdInput = '';
  }

  getComponentName() {
    return this.selectedNode.getMetadata().displayName;
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode') && this.selectedNode) {
      this.webbitIdInput = this.getWebbitId();
    }
  }

  getWebbitId() {
    return this.selectedNode.getWebbitId();
  }

  isWebbitIdInputModified() {
    if (!this.selectedNode) {
      return false;
    }

    return this.getWebbitId() !== this.webbitIdInput || this.webbitIdInput === null;
  }

  isInputModified() {
    return this.isWebbitIdInputModified();
  }

  checkWebbitIdValidity() {

    if (this.value === this.webbitId) {
      return true;
    }

    return !webbitRegistry.hasWebbit(this.value)
  }

  onWebbitIdInputChange(ev) {
    const input = ev.target || ev.path[0];
    this.webbitIdInput = input.value;
  }

  onCancel() {
    this.webbitIdInput = this.getWebbitId();
  }

  onConfirm() {

    const webbitIdNode = this.shadowRoot.querySelector('[part="webbit-id"]');

    if (!webbitIdNode.invalid) {
      this.selectedNode.getNode().webbitId = this.webbitIdInput;
      this.requestUpdate();
    }
  }

  renderWebbit() {
    return html`
      <p>Properties for <span>${this.selectedNode.getName()}</span></p>
      <div part="main-fields">
        <vaadin-text-field
          label="Webbit ID"
          part="webbit-id"
          clear-button-visible
          .webbitId="${this.getWebbitId()}" 
          value="${this.webbitIdInput || ''}"
          @change="${this.onWebbitIdInputChange}"
          .checkValidity="${this.checkWebbitIdValidity}"
          error-message="The ID entered is in use"
          theme="small"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Component Type"
          readonly
          value="${this.getComponentName()}"
          theme="small"
        ></vaadin-text-field>
      </div>

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
    return html`
      ${!this.selectedNode ? html`
        Select an element to view its properties.
      ` : ''}
      ${(this.selectedNode && !this.selectedNode.isWebbit()) ? html`
        This properties for this element cannot be changed.
      ` : ''}

      ${this.selectedNode && this.selectedNode.isWebbit() ? html`
        ${this.renderWebbit()}
      ` : ''}
    `;
  }
}

customElements.define('dashboard-properties-tool', PropertiesTool);