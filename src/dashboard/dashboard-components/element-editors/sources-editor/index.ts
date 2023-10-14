import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './sources-view';
import FrcDashboard from '../../../frc-dashboard';
import './caret';

const sourceStyles = css`
  summary {
    display: flex;
  }

  summary div {
    height: 25px;
    display: inline-flex;
    align-items: center;
    cursor: default;
  }

  td .opened-cursor {
    display: none;
    width: 15px;
    margin-right: 3px;
  }

  td .closed-cursor {
    display: inline-block;
    width: 15px;
    margin-right: 3px;
  }

  td.open .opened-cursor {
    display: inline-block;
  }

  td.open .closed-cursor {
    display: none;
  }

  details > summary {
    list-style: none;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    display: none;
  }

  td.selected > summary {
    background-color: #ddd;
  }

  details:not(.selected) > summary:hover button {
    display: inline-block;
  }

  .header {
    width: 96%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }

  .header .key {
    width: 60%;
    display: flex;
    white-space: nowrap;
    align-items: center;
    height: 100%;
    padding-left: calc(5px + 15px * var(--level));
    box-sizing: border-box;
  }

  .header .value {
    width: 35%;
    overflow: auto;
    white-space: nowrap;
    text-overflow: clip;
    display: inline-block;
  }

  .header .value::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  button {
    display: none;
    border-radius: 10px;
    background-color: lightblue;
    border: none;
    margin-left: 5px;
    cursor: pointer;
    font-size: 14px;
    height: 20px;
  }
`;

@customElement('dashboard-sources-editor')
export class SourcesEditor extends LitElement {
  static styles = [
    sourceStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        font-family: sans-serif;
        box-sizing: border-box;
        padding: 5px;
        background: white;
        overflow: hidden;
        flex: 1;
      }

      .key-value-table {
        border-collapse: collapse;
        font-size: 0.9em;
        font-family: sans-serif;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
      }

      .key-value-table thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: left;
      }

      .key-value-table th {
        text-align: left;
      }

      .key-value-table th,
      .key-value-table td {
        padding: 5px 15px;
        max-width: 600px;
      }

      .key-value-table td {
        padding-left: calc(12px + 22px * var(--level));
      }

      .key-value-table td div {
        max-height: 150px;
        overflow-y: auto;
      }

      .key-value-table tbody dashboard-source-view {
        border-bottom: 1px solid #dddddd;
      }

      .key-value-table tbody dashboard-source-view:nth-of-type(even) {
        background-color: #f3f3f3;
      }

      .key-value-table tbody dashboard-source-view.active-row {
        font-weight: bold;
        color: #009879;
      }

      dashboard-sources-view {
        height: 100%;
      }

      dashboard-source-view {
        font-family: sans-serif;
        font-size: 16px;
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        height: 15px;
      }

      .accordion {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .accordion label {
        padding: 5px 0;
      }

      .accordion .content {
        display: none;
      }

      .accordion label.selected + .content {
        flex: 1;
        display: block;
      }
    `,
  ];

  @property({ type: Object, attribute: false }) dashboard!: FrcDashboard;

  @state() sourceKeys: Record<string, Set<string>> = {};

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

  onSourceKeyInputChange(ev: any) {
    const input = ev.target || ev.path[0];
    this.sourceKey = input.value;
    this.requestUpdate();
  }

  onSourceProviderInputChange(ev: any) {
    const input = ev.target || ev.path[0];
    this.sourceProvider = input.value;
    this.requestUpdate();
  }

  onSourceSelect(ev: any) {
    const { sourceKey, sourceProvider } = ev.detail;
    this.sourceKey = sourceKey;
    this.sourceProvider = sourceProvider;
    this.requestUpdate();
  }

  // for autocompletion
  getSourceKeyItems() {
    return [...(this.sourceKeys[this.sourceProvider] ?? [])];
  }

  updateSourceKeySet(providerName: string, key: string) {
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
