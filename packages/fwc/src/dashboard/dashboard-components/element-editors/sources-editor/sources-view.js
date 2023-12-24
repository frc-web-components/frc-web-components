import { LitElement, html, css } from 'lit';
import './source-view';

class SourcesView extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }
    p {
      margin: 8px 0 5px;
      font-weight: bold;
    }

    vaadin-accordion-panel {
      border-bottom: none;
    }
  `;

  static properties = {
    sourceKey: { type: String },
    sourceProvider: { type: String },
    store: { type: Object },
    disabled: { type: Boolean },
  };

  constructor() {
    super();
    this.sourceKey = '';
    this.sourceProvider = '';
    this.store = null;
    this.disabled = false;
  }

  get sourceProviderNames() {
    return this.store?.getSourceProviderNames() ?? [];
  }

  firstUpdated() {
    this.store.sourceProviderAdded((name) => {
      this.store.subscribeAll(
        name,
        () => {
          this.requestUpdate();
        },
        true
      );
    });
    this.sourceProviderNames.forEach((name) => {
      this.store.subscribeAll(
        name,
        () => {
          this.requestUpdate();
        },
        true
      );
    });
  }

  renderSources(providerName) {
    const rootSource = this.store.getSource(providerName, '');
    const sources = rootSource?.getChildren() ?? {};
    const sourceEntries = Object.entries(sources);
    const selectedSource =
      this.sourceKey && this.store
        ? this.store.getSource(this.sourceProvider, this.sourceKey)
        : null;
    return html`
      ${sourceEntries.map(
        ([name, source]) => html`
          <dashboard-source-view
            ?only-child="${sourceEntries.length === 1}"
            .label="${name}"
            .providerName="${providerName}"
            .source="${source}"
            .selectedSourceKey="${this.sourceKey}"
            .selectedSourceProvider="${this.sourceProvider}"
            .selectedSource="${selectedSource}"
            .store="${this.store}"
            ?disabled=${this.disabled}
          >
          </dashboard-source-view>
        `
      )}
    `;
  }

  render() {
    if (this.sourceProviderNames.length === 0) {
      return html` <p>There are no sources currently available.</p> `;
    }

    return html`
      <vaadin-accordion opened="${null}">
        ${this.sourceProviderNames.map(
          (name) => html`
            <vaadin-accordion-panel theme="small">
              <div slot="summary">${name}</div>
              <div>${this.renderSources(name)}</div>
            </vaadin-accordion-panel>
          `
        )}
      </vaadin-accordion>
    `;
  }
}

customElements.define('dashboard-sources-view', SourcesView);
