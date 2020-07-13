import { LitElement, html, css } from 'lit-element';
import './string-property-view';
import './number-property-view';
import './boolean-property-view';
import './array-property-view';

class PropertiesView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }

      [part=category-name] {
        text-transform: capitalize;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      selectedNode: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedNode = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode')) {
      this.inputElements = this.shadowRoot.querySelectorAll('[part="input"]');
    }
  }

  isInputModified() {
    for (let input of this.inputElements) {
      if (input.isInputModified()) {
        return true;
      }
    }
    return false;
  }

  isValid() {
    for (let input of this.inputElements) {
      if (!input.isValid()) {
        return false;
      }
    }
    return true;
  }

  confirm() {
    const propertyValueMap = {};

    for (let input of this.inputElements) {
      const [propertyName, inputValue] = input.getPropertyNameValuePair();
      propertyValueMap[propertyName] = inputValue;
    }

    this.wom.selectAction('setProperties', { propertyValueMap });
  }

  cancel() {
    for (let input of this.inputElements) {
      input.cancel();
    }
  }

  renderProperties(properties, category) {
    const categoryProperties = properties.filter(([name, property]) => {
      return property.category === category;
    });

    return html`
      <vaadin-form-layout>
        ${categoryProperties.map(([name, property]) => html`
          ${property.type === String ? html`
            <dashboard-string-property-view
              part="input"
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-string-property-view>
          ` : ''}

          ${property.type === Number ? html`
            <dashboard-number-property-view
              part="input"
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-number-property-view>
          ` : ''}

          ${property.type === Boolean ? html`
            <dashboard-boolean-property-view
              part="input"
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-boolean-property-view>
          ` : ''}

          ${property.type === Array ? html`
            <dashboard-array-property-view
              part="input"
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-array-property-view>
          ` : ''}
        `)}
      </vaadin-form-layout>
    `;
  }

  render() {

    const properties = Object.entries(this.selectedNode.getNode().constructor.properties);

    const propertiesForSources = properties.filter(([name, property]) => {
      return property.canConnectToSources;
    });

    const categories = [this.selectedNode.getDisplayName(), 'Styles'];


    return html`
      <vaadin-accordion>
        ${categories.map(category => html`
          <vaadin-accordion-panel>
            <div part="category-name" slot="summary">${category}</div>
            ${this.renderProperties(propertiesForSources, category)}
          </vaadin-accordion-panel>
        `)}
      </vaadin-accordion>
    `;
  }
}

customElements.define('dashboard-properties-view', PropertiesView);