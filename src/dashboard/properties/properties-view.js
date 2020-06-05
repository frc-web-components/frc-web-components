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
    `;
  }

  static get properties() {
    return {
      selectedNode: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.selectedNode = null;
  }

  render() {

    const properties = Object.entries(this.selectedNode.getNode().constructor.properties);

    const propertiesForSources = properties.filter(([name, property]) => {
      return property.canConnectToSources;
    });

    return html`
      <vaadin-form-layout>
        ${propertiesForSources.map(([name, property]) => html`
          ${property.type === String ? html`
            <dashboard-string-property-view
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-string-property-view>
          ` : ''}

          ${property.type === Number ? html`
            <dashboard-number-property-view
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-number-property-view>
          ` : ''}

          ${property.type === Boolean ? html`
            <dashboard-boolean-property-view
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-boolean-property-view>
          ` : ''}

          ${property.type === Array ? html`
            <dashboard-array-property-view
              .selectedNode="${this.selectedNode}"
              .propertyName="${name}"
              .property="${property}"
            ></dashboard-array-property-view>
          ` : ''}
        `)}
      </vaadin-form-layout>
    `;
  }
}

customElements.define('dashboard-properties-view', PropertiesView);