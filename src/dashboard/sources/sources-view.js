import { LitElement, html, css } from 'lit-element';
import { 
  sourceProviderAdded, 
  getSourceProviderNames,
  getSourceProvider ,
  getRawSources,
  subscribeAll
} from '@webbitjs/store';
import './source-view';

class SourcesView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
      }

      p {
        margin: 8px 0 5px;
        font-weight: bold;
      }
    `;
  }

  static get properties() {
    return {
      selectedSourceKey: { type: String, attribute: 'selected-source-key' },
      selectedSourceProvider: { type: String, attribute: 'selected-source-provider' },
      providers: { type: Array },
    };
  }

  constructor() {
    super();
    this.selectedSourceKey = '';
    this.selectedSourceProvider = '';
    this.providers = [];
    this.unsubscribers = {};
  }

  setProviders() {
    this.providers = getSourceProviderNames().map(name => {
      return getSourceProvider(name);
    });
  }

  firstUpdated() {
    sourceProviderAdded(() => {
      this.setProviders();
    });
    this.setProviders();
  }

  updated(changedProperties) {
    if (changedProperties.has('providers')) {
      Object.entries(this.unsubscribers).map(([name, unsubscribe]) => {
        unsubscribe();
      });
      this.unsubscribers = {};
      this.providers.forEach(provider => {
        this.unsubscribers[provider._providerName] = subscribeAll(provider._providerName, () => {
          this.requestUpdate();
        });
      });
    }
  }

  getLabel(name) {
    if (!name) {
      return '';
    }

    const parts = name.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }

  renderSources(provider) {
    const rootSource = getRawSources(provider._providerName);
    const sources = rootSource ? rootSource.__sources__ : {}; 
    const sourceEntries = Object.entries(sources);
    return html`
      ${sourceEntries.map(([name, source]) => html`
        <dashboard-source-view 
          ?only-child="${sourceEntries.length === 1}"
          label="${this.getLabel(source.__key__)}" 
          provider-name="${provider._providerName}"
          .source="${{...source}}"
          selected-source-key="${this.selectedSourceKey}"
          selected-source-provider="${this.selectedSourceProvider}"
        >
        </dashboard-source-view>
      `)}
    `;
  }


  render() {
    if (this.providers.length === 0) {
      return html`
        <p>There are no sources currently available.</p>
      `;
    }

    return html`
      <p>All Sources</p>
      <vaadin-accordion opened="${null}">
        ${this.providers.map(provider => html`
          <vaadin-accordion-panel theme="small">
            <div slot="summary">${provider._providerName}</div>
            <div>${this.renderSources(provider)}</div>
          </vaadin-accordion-panel>
        `)}
      </vaadin-accordion>
    `;
  }
}

customElements.define('dashboard-sources-view', SourcesView);