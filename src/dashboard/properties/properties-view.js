import { LitElement, html, css } from 'lit-element';

class PropertiesView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
      }

      vaadin-form-item label {
        text-transform: capitalize;
      }

      vaadin-text-field, vaadin-number-field {
        width: 100%;
        /* padding-top: 5px; */
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

    console.log('properties:', propertiesForSources);

    return html`
      <vaadin-form-layout>
      ${propertiesForSources.map(([name, property]) => html`
        ${property.type === String ? html`
          <vaadin-form-item>
            <label slot="label">${property.attribute.replace('-', ' ')}</label>
            <vaadin-text-field
              value="${this.selectedNode.getNode()[name]}"
              theme="small"
            ></vaadin-text-field>
          </vaadin-form-item>
        ` : ''}

        ${property.type === Number ? html`
          <vaadin-form-item>
            <label slot="label">${property.attribute.replace(/-/g, ' ')}</label>
            <vaadin-number-field
              value="${this.selectedNode.getNode()[name]}"
              theme="small"
            ></vaadin-number-field>
          </vaadin-form-item>
        ` : ''}

        ${property.type === Boolean ? html`
        <vaadin-form-item>
            <label slot="label">${property.attribute.replace(/-/g, ' ')}</label>
            <vaadin-checkbox
              ?checked="${this.selectedNode.getNode()[name]}"
              theme="small"
            ></vaadin-checkbox>
          </vaadin-form-item>
        ` : ''}
      `)}
      </vaadin-form-layout>
    `;
  }
}

customElements.define('dashboard-properties-view', PropertiesView);