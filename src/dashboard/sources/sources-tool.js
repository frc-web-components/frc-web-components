import { LitElement, html, css } from 'lit-element';
import './sources-view';

class SourcesTool extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
      }

      [part=source-fields] {
        display: flex;
      }

      [part=source-fields] vaadin-text-field {
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
      sourceKeyInput: { type: String, attribute: false },
      sourceProviderInput: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.selectedNode = null;
    this.sourceKeyInput = '';
    this.sourceProviderInput = '';
  }

  getSourceKey() {
    const sourceKey = this.selectedNode.getNode().sourceKey;
    return sourceKey;
  }

  getSourceProvider() {
    const sourceProvider = this.selectedNode.getNode().sourceProvider;
    return sourceProvider;
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode') && this.selectedNode) {
      this.sourceKeyInput = this.getSourceKey();
      this.sourceProviderInput = this.getSourceProvider();
    }
  }

  isSourceKeyInputModified() {
    if (!this.selectedNode) {
      return false;
    }

    return this.getSourceKey() !== this.sourceKeyInput || this.sourceKeyInput === null;
  }

  isSourceProviderInputModified() {
    if (!this.selectedNode) {
      return false;
    }

    return this.getSourceProvider() !== this.sourceProviderInput;
  }

  isInputModified() {
    return this.isSourceKeyInputModified() || this.isSourceProviderInputModified();
  }

  onSourceKeyInputChange(ev) {
    const input = ev.target || ev.path[0];
    this.sourceKeyInput = input.value;
  }

  onSourceProviderInputChange(ev) {
    const input = ev.target || ev.path[0];
    this.sourceProviderInput = input.value;
  }

  onCancel() {
    this.sourceKeyInput = this.getSourceKey();
    this.sourceProviderInput = this.getSourceProvider();
  }

  onConfirm() {
    this.selectedNode.getNode().sourceProvider = this.sourceProviderInput;
    this.selectedNode.getNode().sourceKey = this.sourceKeyInput;
    this.requestUpdate();
  }

  onSourceSelect(ev) {
    const { sourceKey, sourceProvider } = ev.detail;
    this.sourceKeyInput = sourceKey;
    this.sourceProviderInput = sourceProvider;
  }

  renderWebbit() {
    return html`
      <p>Source for <span>${this.selectedNode.getWebbitId()}</span></p>
      <div part="source-fields">
        <vaadin-text-field
          label="Source Key"
          clear-button-visible 
          value="${this.sourceKeyInput || ''}"
          @change="${this.onSourceKeyInputChange}"
          theme="small"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Source Provider"
          clear-button-visible 
          value="${this.sourceProviderInput || ''}"
          @change="${this.onSourceProviderInputChange}"
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
      <dashboard-sources-view
        selected-source-key="${this.sourceKeyInput}"
        selected-source-provider="${this.sourceProviderInput}"
        @sourceSelect="${this.onSourceSelect}"
      ></dashboard-sources-view>
    `;
  }


  render() {
    return html`
      ${!this.selectedNode ? html`
        Select an element to view sources.
      ` : ''}
      ${(this.selectedNode && !this.selectedNode.isWebbit()) ? html`
        Sources cannot be applied to this element.
      ` : ''}

      ${this.selectedNode && this.selectedNode.isWebbit() ? html`
        ${this.renderWebbit()}
      ` : ''}
    `;
  }
}

customElements.define('dashboard-sources-tool', SourcesTool);