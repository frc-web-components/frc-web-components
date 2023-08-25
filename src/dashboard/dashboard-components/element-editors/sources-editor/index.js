import { LitElement, html, css } from 'lit';
import './sources-view';

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    box-sizing: border-box;
    padding: 5px;
  }
`;

class SourcesEditor extends LitElement {
  static styles = styles;

  static properties = {
    dashboard: { attribute: false },
  };

  constructor() {
    super();
    this.sourceKeys = {};
  }

  get #element() {
    return this.dashboard.getSelectedElement();
  }

  get #connector() {
    return this.dashboard.getConnector();
  }

  get webbit() {
    return this.#element && this.#connector?.getElementWebbit(this.#element);
  }

  get sourceProvider() {
    return this.webbit?.sourceProvider ?? '';
  }

  set sourceProvider(value) {
    if (this.webbit) {
      this.webbit.sourceProvider = value;
    }
  }

  get sourceKey() {
    return this.webbit?.sourceKey ?? '';
  }

  set sourceKey(value) {
    if (this.webbit) {
      this.webbit.sourceKey = value;
    }
  }

  get store() {
    return this.dashboard.getStore();
  }

  get defaultSourceProvider() {
    return this.store?.getDefaultSourceProvider();
  }

  get sourceProviderNames() {
    return this.store?.getSourceProviderNames() ?? [];
  }

  onSourceKeyInputChange(ev) {
    const input = ev.target || ev.path[0];
    this.sourceKey = input.value;
    this.requestUpdate();
  }

  onSourceProviderInputChange(ev) {
    const input = ev.target || ev.path[0];
    this.sourceProvider = input.value;
    this.requestUpdate();
  }

  onSourceSelect(ev) {
    const { sourceKey, sourceProvider } = ev.detail;
    this.sourceKey = sourceKey;
    this.sourceProvider = sourceProvider;
    this.requestUpdate();
  }

  // for autocompletion
  getSourceKeyItems() {
    return [...(this.sourceKeys[this.sourceProvider] ?? [])];
  }

  updateSourceKeySet(providerName, key) {
    if (this.store.getSource(providerName, key)) {
      if (!this.sourceKeys[providerName].has(key)) {
        this.sourceKeys[providerName].add(key);
        this.requestUpdate();
      }
    } else if (this.sourceKeys[providerName].has(key)) {
      this.sourceKeys[providerName].delete(key);
      this.requestUpdate();
    }
  }

  firstUpdated() {
    this.store.sourceProviderAdded((name) => {
      this.sourceKeys[name] = new Set();
      this.store.subscribeAll(
        name,
        (value, key) => {
          this.updateSourceKeySet(name, key);
        },
        true
      );
    });
    this.sourceProviderNames.forEach((name) => {
      this.sourceKeys[name] = new Set();
      this.store.subscribeAll(
        name,
        (value, key) => {
          this.updateSourceKeySet(name, key);
        },
        true
      );
    });
    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());
  }

  render() {
    const webbit = this.#element
      ? this.#connector?.getElementWebbit(this.#element)
      : null;
    const disabled = !this.#element || !webbit;

    return html`
      <dashboard-sources-view
        @sourceSelect="${this.onSourceSelect}"
        .sourceKey="${this.sourceKey}"
        .sourceProvider="${this.sourceProvider}"
        .store="${this.store}"
        ?disabled=${disabled}
      ></dashboard-sources-view>
    `;
  }
}

customElements.define('dashboard-sources-editor', SourcesEditor);
