import { LitElement, html, css } from 'lit';

function classMap(classes) {
  const filteredClasses = Object.entries(classes)
    .filter(([, filter]) => filter)
    .map(([className]) => className);
  return filteredClasses.join(' ');
}

const styles = css`
  :host {
    display: block;
    font-family: sans-serif;
    font-size: 16px;
  }

  summary {
    display: flex;
    border-bottom: 1px solid rgb(187, 187, 187);
  }

  summary div {
    height: 25px;
    display: inline-flex;
    align-items: center;
    cursor: default;
  }

  details .opened-cursor {
    display: none;
    width: 15px;
    margin-right: 3px;
  }

  details .closed-cursor {
    display: inline-block;
    width: 15px;
    margin-right: 3px;
  }

  details[open] > summary .opened-cursor {
    display: inline-block;
  }

  details[open] > summary .closed-cursor {
    display: none;
  }

  details > summary {
    list-style: none;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    display: none;
  }

  details.selected > summary {
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

class SourceView extends LitElement {
  static styles = styles;

  static properties = {
    onlyChild: { type: Boolean, attribute: 'only-child' },
    label: { type: String },
    providerName: { type: String },
    source: { type: Object },
    level: { type: Number },
    selectedSourceKey: { type: String },
    selectedSourceProvider: { type: String },
    selectedSource: { type: Object },
    store: { type: Object },
    disabled: { type: Boolean },
  };

  constructor() {
    super();
    this.label = '';
    this.providerName = '';
    this.source = null;
    this.level = 0;
    this.selectedSourceKey = '';
    this.selectedSourceProvider = '';
    this.selectedSource = null;
    this.store = null;
    this.disabled = false;
  }

  get detailsElement() {
    return this.renderRoot.querySelector('details');
  }

  hasSources() {
    return this.source.hasChildren();
  }

  hasValue() {
    return this.source.hasValue();
  }

  isSelected() {
    return this.source === this.selectedSource;
  }

  isSelectedKeyDescendent() {
    if (!this.selectedSource) {
      return false;
    }
    return this.selectedSource.getKey().startsWith(this.source.getKey() + '/');
  }

  updated(changedProps) {
    if (changedProps.has('selectedSource')) {
      if (this.isSelectedKeyDescendent()) {
        this.detailsElement.open = true;
      }
    }
  }

  firstUpdated() {
    this.store.subscribe(
      this.providerName,
      this.source.getKey(),
      () => this.requestUpdate(),
      true
    );
  }

  onSelect() {
    const event = new CustomEvent('sourceSelect', {
      bubbles: true,
      composed: true,
      detail: {
        sourceKey: this.source.getKey(),
        sourceProvider: this.providerName,
      },
    });
    this.dispatchEvent(event);
  }

  renderValue() {
    const value = this.source.getValue();

    if (typeof value === 'boolean') {
      return html`
        <input disabled type="checkbox" ?checked="${value}" />
        <label>${value.toString()}</label>
      `;
    } else if (typeof value === 'string') {
      return html` "${value}" `;
    } else if (typeof value === 'number') {
      return html` ${value} `;
    } else if (value instanceof Array) {
      return html` [${value.join(', ')}] `;
    }

    return html``;
  }

  renderChildSources() {
    if (!this.hasSources()) {
      return null;
    }

    const sources = this.source.getChildren();
    const sourceEntries = Object.entries(sources);

    return html`
      <div class="sources">
        ${sourceEntries.map(
          ([name, source]) => html`
            <dashboard-source-view
              ?only-child="${sourceEntries.length === 1}"
              .label="${name}"
              .providerName="${this.providerName}"
              .source="${source}"
              .level="${this.level + 1}"
              .selectedSourceKey="${this.selectedSourceKey}"
              .selectedSourceProvider="${this.selectedSourceProvider}"
              .selectedSource="${this.selectedSource}"
              .store="${this.store}"
              ?disabled=${this.disabled}
            >
            </dashboard-source-view>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <details
        style=${`--level: ${this.level}`}
        class=${classMap({
          childless: !this.hasSources(),
          selected: this.isSelected(),
        })}
      >
        <summary>
          <div class="header">
            <span class="key">
              ${this.hasSources()
                ? html`
                    <span class="caret">
                      <vaadin-icon
                        icon="vaadin:angle-right"
                        class="closed-cursor"
                      ></vaadin-icon>
                      <vaadin-icon
                        icon="vaadin:angle-down"
                        class="opened-cursor"
                      ></vaadin-icon>
                    </span>
                  `
                : ''}
              <label>${this.label !== '' ? this.label : html`&nbsp;`}</label>
              ${!this.disabled
                ? html` <button @click="${this.onSelect}">Select</button> `
                : ''}
            </span>
            <span class="value">
              ${this.hasValue() ? this.renderValue() : ''}
            </span>
          </div>
        </summary>
        ${this.renderChildSources()}
      </details>
    `;
  }
}

customElements.define('dashboard-source-view', SourceView);
