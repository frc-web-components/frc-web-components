import { LitElement, html, css } from 'lit';
import './dashboard-component-render';

const styles = css`
  :host {
    display: block;
    padding: 15px 10px;
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
    dashboard: { attribute: false }
  };

  static styles = styles;

  constructor() {
    super();
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

  firstUpdated() {
    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());
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
      <div class="properties-view">
        <vaadin-form-layout @change=${this.onValueChange}>
          ${Object.entries(properties)
            .filter(([, { type }]) => !['SourceProvider', 'Store'].includes(type))
            .filter(([, { input }]) => input?.type !== 'None')
            .map(([name]) => {
              return this.renderPropertyView(name, webbit.getPropertyHandler(name));
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
        .config=${{ element: this.#element, propertyHandler, propertyName: name }}
        .dashboard=${this.dashboard}
      ></dashboard-component-renderer>
    `;
  }
}

customElements.define('dashboard-properties-editor', PropertiesEditor);