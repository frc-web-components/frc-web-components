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

      vaadin-form-layout vaadin-combo-box, vaadin-form-layout multiselect-combo-box {
        width: calc(100% - 5px);
      }

      vaadin-form-layout vaadin-form-item::part(label) {
        margin-top: 10px;
      }

    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      selectedNode: { type: Object, attribute: false },
      sourceKeyInput: { type: String, attribute: false },
      sourceProviderInput: { type: String, attribute: false },
      fromPropertiesInput: { type: Array, attribute: false }
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedNode = null;
    this.sourceKeyInput = '';
    this.sourceProviderInput = '';
    this.fromPropertiesInput = [];
  }

  getSourceKey() {
    const sourceKey = this.selectedNode.getNode().sourceKey;
    return sourceKey;
  }

  getSourceProvider() {
    const sourceProvider = this.selectedNode.getNode().sourceProvider;
    return sourceProvider;
  }

  getFromProperties() {
    const fromProperties = this.selectedNode.getNode().fromProperties;
    return fromProperties;
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode') && this.selectedNode) {
      this.sourceKeyInput = this.getSourceKey();
      this.sourceProviderInput = this.getSourceProvider();
      const properties = this.selectedNode.getNode().constructor.properties;
      this.fromPropertiesInput = this.getFromProperties()
        .filter(name => name in properties && properties[name].canConnectToSources)
        .map(name => ({
          value: name,
          label: properties[name].attribute.replace(/-/g, ' ')
        }));
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

  isFromPropertiesInputModified() {
    if (!this.selectedNode) {
      return false;
    }

    const fromProperties = this.getFromProperties();

    if (fromProperties.length !== this.fromPropertiesInput.length) {
      return true;
    }

    for (let property of this.fromPropertiesInput) {
      if (!fromProperties.includes(property.value)) {
        return true;
      }
    }

    return false;
  }

  isInputModified() {
    return this.isSourceKeyInputModified() || this.isSourceProviderInputModified() || this.isFromPropertiesInputModified();
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
      sourceKey: this.sourceKeyInput,
      fromProperties: this.fromPropertiesInput.map(item => item.value),
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

  getProperties() {
    const properties = Object.entries(this.selectedNode.getNode().constructor.properties);

    return properties
      .filter(([name, property]) => {
        return property.canConnectToSources;
      })
      .map(([name, property]) => {
        return {
          value: name,
          label: property.attribute.replace(/-/g, ' ')
        };
      });
  }

  onSetFromPropertiesInputChange() {
    const inputElement = this.shadowRoot.querySelector('[part=set-from-properties-dropdown]');
    this.fromPropertiesInput = inputElement.selectedItems;
  }

  renderWebbit() {
    return html`
      <p>Source for <span>${this.selectedNode.getWebbitId()}</span></p>
      <vaadin-form-layout>
        <vaadin-form-item>
          <label slot="label">Source Key</label>
          <vaadin-combo-box
            part="source-key-dropdown"
            clear-button-visible 
            value="${this.sourceKeyInput || ''}"
            .items="${this.getSourceKeyItems()}"
            @change="${this.onSourceKeyInputChange}"
            theme="small"
            allow-custom-value
          >
          </vaadin-combo-box>
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Source Provider</label>
          <vaadin-combo-box 
            clear-button-visible
            value="${this.sourceProviderInput || ''}"
            .items="${getSourceProviderNames()}"
            @change="${this.onSourceProviderInputChange}"
            theme="small"
          ></vaadin-combo-box>
        </vaadin-form-item>
        <vaadin-form-item>
          <label 
            slot="label" 
            title="Each property listed will have its source's initial value be set to the property's value."
          >Set Source Defaults from Properties</label>
          <multiselect-combo-box
            part="set-from-properties-dropdown"
            clear-button-visible 
            .selectedItems="${this.fromPropertiesInput || []}"
            .items="${this.getProperties()}"
            @change="${this.onSetFromPropertiesInputChange}"
            theme="small"
            item-label-path="label" 
            item-value-path="value"
            item-id-path="value"
          >
          </multiselect-combo-box>
        </vaadin-form-item>
      </vaadin-form-layout>

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

  renderSelectedNodeInputs() {

    if (!this.selectedNode) {
      return html`<p>Select an element to change its source.</p>`;
    }

    if (this.selectedNode === this.wom.getRootNode()) {
      return html`<p>The source for the root node cannot be changed.</p>`;
    }

    if (this.selectedNode && !this.selectedNode.isWebbit()) {
      return html`<p>Sources cannot be applied to this element.</p>`;
    }

    return this.renderWebbit();
  }


  render() {
    return html`
      ${this.renderSelectedNodeInputs()}
      <dashboard-sources-view
        selected-source-key="${this.sourceKeyInput}"
        selected-source-provider="${this.sourceProviderInput}"
        @sourceSelect="${this.onSourceSelect}"
      ></dashboard-sources-view>
    `;
  }
}

customElements.define('dashboard-sources-tool', SourcesTool);