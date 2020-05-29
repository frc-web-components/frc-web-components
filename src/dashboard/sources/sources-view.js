import { LitElement, html, css } from 'lit-element';
import { 
  sourceProviderAdded, 
  getSourceProviderNames,
  getSourceProvider ,
  getRawSources
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
    this.selectedSourceKey = null;
    this.selectedSourceProvider = null;
    this.providers = [];
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
    const sources = rootSource.__sources__;

    return html`
      ${Object.entries(sources).map(([name, source]) => html`
        <source-view 
          label="${this.getLabel(source.__key__)}" 
          provider-name="${provider._providerName}"
          .source="${{...source}}"
        >
        </source-view>
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
      <vaadin-accordion>
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