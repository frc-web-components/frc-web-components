import { LitElement, html, css } from 'lit';
import './dashboard-component-render';

const styles = css`
  :host {
    display: block;
    font-family: sans-serif;
    height: 100%;
    box-sizing: border-box;
  }

  p {
    margin-top: 0;
    font-weight: bold;
  }

  p span {
    color: purple;
  }

  .properties-view {
    padding-bottom: 10px;
  }

  .properties-view:last-child {
    padding-bottom: 0;
  }
`;

class PropertiesEditor extends LitElement {
  static properties = {
    dashboard: { attribute: false },
    dialogOpened: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.disalogOpened = false;
    this.sourceChangeObserver = null;
  }

  get #element() {
    return this.dashboard.getSelectedElement();
  }

  get #connector() {
    return this.dashboard.getConnector();
  }

  get inputElement() {
    return this.renderRoot.querySelector('[part=input]');
  }

  get webbit() {
    return this.#element && this.#connector?.getElementWebbit(this.#element);
  }

  get sourceKey() {
    return this.webbit?.sourceKey ?? '';
  }

  get sourceProvider() {
    return this.webbit?.sourceProvider ?? '';
  }

  get store() {
    return this.dashboard.getStore();
  }

  get defaultSourceProvider() {
    return this.store?.getDefaultSourceProvider();
  }

  get sourceDialog() {
    return this.renderRoot.querySelector('vaadin-dialog');
  }

  updateSourceChangedObserver() {
    this.sourceChangeObserver?.disconnect();
    if (this.#element) {
      this.sourceChangeObserver = new MutationObserver(() => {
        this.requestUpdate();
      });
      this.sourceChangeObserver.observe(this.#element, {
        attributes: true,
        attributeFilter: ['source-provider', 'source-key'],
      });
    }
  }

  firstUpdated() {
    this.dashboard.subscribe('elementSelect', () => {
      this.requestUpdate();
    });
    this.updateSourceChangedObserver();
  }

  disconnectedCallback() {
    this.sourceChangeObserver?.disconnect();
  }

  render() {
    if (!this.#element) {
      return html``;
    }

    const webbit = this.#connector?.getElementWebbit(this.#element);

    if (!webbit) {
      return html``;
    }
    const { properties } = webbit.getConfig();

    return html`
      <vaadin-text-field
        part="source-key-dropdown"
        label=${'Source' +
        (this.sourceProvider ? ` (${this.sourceProvider})` : '') +
        ':'}
        theme="small"
        readonly
        .value=${this.sourceKey || 'Connect to a data source...'}
        style="width: 100%; margin-bottom: 10px"
      >
        <vaadin-icon
          slot="suffix"
          icon="vaadin:edit"
          style="cursor: pointer"
          title="edit"
          @click=${() => this.dashboard.publish('sourcesDialogOpen')}
        ></vaadin-icon>
      </vaadin-text-field>
      <div class="properties-view">
        <vaadin-form-layout @change=${this.onValueChange}>
          ${Object.entries(properties)
            .filter(
              ([, { type }]) => !['SourceProvider', 'Store'].includes(type)
            )
            .filter(([, { input }]) => input?.type !== 'None')
            .map(([name]) => {
              return this.renderPropertyView(
                name,
                webbit.getPropertyHandler(name)
              );
            })}
        </vaadin-form-layout>
      </div>
    `;
  }

  renderPropertyView(name, propertyHandler) {
    const property = propertyHandler.getProperty();

    const inputType = property.input?.type ?? property.type;

    return html`
      <dashboard-component-renderer
        component-type="propertyInput"
        component-id=${inputType}
        .config=${{
          element: this.#element,
          propertyHandler,
          propertyName: name,
        }}
        .dashboard=${this.dashboard}
      ></dashboard-component-renderer>
    `;
  }
}

customElements.define('dashboard-properties-editor', PropertiesEditor);
