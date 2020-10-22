import { LitElement, html, css } from 'lit-element';
import { getSourceProviderNames, getSources } from '@webbitjs/store';
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

      [part=source-fields] vaadin-combo-box {
        flex: 1;
        margin-right: 7px;
        min-width: 120px;
      }

      [part=source-fields] vaadin-combo-box::part(text-field) {
        padding-top: 0;
      }

      [part=source-key-dropdown] {
        --vaadin-combo-box-overlay-width: 400px;
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
      sourceKeyInput: { type: String, attribute: false },
      sourceProviderInput: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.wom = null;
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
    this.wom.executeAction('setSource', {
      sourceProvider: this.sourceProviderInput,
      sourceKey: this.sourceKeyInput
    });
    this.requestUpdate();
  }

  onSourceSelect(ev) {
    const { sourceKey, sourceProvider } = ev.detail;
    this.sourceKeyInput = sourceKey;
    this.sourceProviderInput = sourceProvider;
  }

  getSourceKeyItems() {
    const sources = getSources(this.sourceProviderInput || '') || {};
    const keys = Object.getOwnPropertyNames(sources);
    const blankKeyIndex = keys.indexOf('');
    if (blankKeyIndex > -1) {
      keys.splice(blankKeyIndex, 1);
    }
    return keys;
  }

  renderWebbit() {
    return html`
      <p>Source for <span>${this.selectedNode.getWebbitId()}</span></p>
      <div part="source-fields">
        <vaadin-combo-box
          part="source-key-dropdown"
          label="Source Key"
          clear-button-visible 
          value="${this.sourceKeyInput || ''}"
          .items="${this.getSourceKeyItems()}"
          @change="${this.onSourceKeyInputChange}"
          theme="small"
          allow-custom-value
        >
        </vaadin-combo-box>
        <vaadin-combo-box 
          label="Source Provider"
          clear-button-visible
          value="${this.sourceProviderInput || ''}"
          .items="${getSourceProviderNames()}"
          @change="${this.onSourceProviderInputChange}"
          theme="small"
        ></vaadin-combo-box>
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