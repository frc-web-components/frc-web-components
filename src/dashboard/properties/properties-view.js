import { LitElement, html, css } from 'lit-element';
import 'multiselect-combo-box/multiselect-combo-box.js';

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

      vaadin-text-field, vaadin-number-field, multiselect-combo-box {
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

    return html`
      <vaadin-form-layout>
        ${propertiesForSources.map(([name, property]) => html`
          <vaadin-form-item>
            <label slot="label">${property.attribute.replace('-', ' ')}</label>
            ${property.type === String ? html`
              <vaadin-text-field
                value="${this.selectedNode.getNode()[name]}"
                theme="small"
              ></vaadin-text-field>
            ` : ''}

            ${property.type === Number ? html`
              <vaadin-number-field
                value="${this.selectedNode.getNode()[name]}"
                theme="small"
                has-controls
              ></vaadin-number-field>
            ` : ''}

            ${property.type === Boolean ? html`
              <vaadin-checkbox
                ?checked="${this.selectedNode.getNode()[name]}"
                theme="small"
              ></vaadin-checkbox>
            ` : ''}

            ${property.type === Array ? html`
              <multiselect-combo-box 
                theme="small"
                allow-custom-values
                .items="${this.selectedNode.getNode().getAllValues()}"
                .selectedItems="${this.selectedNode.getNode().value}"
              >
              </multiselect-combo-box>
            ` : ''}
          </vaadin-form-item>
        `)}
      </vaadin-form-layout>
    `;
  }
}

customElements.define('dashboard-properties-view', PropertiesView);