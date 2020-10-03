import { LitElement, html, css } from 'lit-element';
import { throttle } from '../../utils';

class ComponentsTool extends LitElement {

  static get styles() {
    return css`

      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
      }

      /* header {
        margin-top: 0;
        margin-bottom: 10px;
        font-weight: bold;
      }

      header span {
        color: purple;
      }

      p {
        margin: 0 0 5px;
        font-size: 15px;
      }

      [part=all-components] {
        width: 60%;
        margin-right: 15px;
      }

      [part=selected-component] {
        flex: 1;
      }

      [part=all-components] header {
        margin-bottom: 8px;
        text-transform: uppercase;
        font-size: 15px;
      }

      [part=component] {
        color: #333;
        cursor: grab;
      }

      [part=component]:active {
        cursor: grabbing;
      }

      [part=category-name] {
        text-transform: capitalize;
      }
      
      [part=component] {
        padding-left: 20px;
      }

      [part=component]:not(.selected):hover {
        background-color: #a1bbeb;
      }

      [part=component].selected {
        background-color: #4781eb;
      } */

      [part=fields] {
        display: flex;
      }

      [part=components] {
        flex: 1;
      }

      [part=components] vaadin-text-field {
        width: 100%;
        padding-top: 0;
      }

      [part=slots] {
        width: 180px;
      }

      [part=fields] > * {
        margin-right: 7px;
        padding-top: 0;
      }

      vaadin-combo-box::part(text-field) {
        padding-top: 0;
      }

      p {
        margin-top: 0;
        font-weight: bold;
      }

      p span {
        color: purple;
      }

      [part=components-list] {
        position: absolute;
        width: 100%;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.3) 4px 4px 15px 2px;
        padding: 5px 7px;
        max-height: 250px;
        overflow: auto;
        box-sizing: border-box;
      }

      [part=component] {
        padding-left: 20px;
      }

      [part=component]:not(.selected):hover {
        background-color: #a1bbeb;
      }

      [part=component].selected {
        background-color: #4781eb;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      selectedNode: { type: Object, attribute: false },
      componentCategories: { type: Array, attribute: false },
      selectedComponent: { type: String, attribute: false },
      showComponentList: { type: Boolean, attribute: false }
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedNode = null;
    this.componentCategories = [];
    this.selectedComponent = '';
    this.showComponentList = false;
  }

  getComponents() {
    return window.webbitRegistry.getRegisteredNames();
  }

  getMetadata(componentName) {
    return window.webbitRegistry.getMetadata(componentName);
  }

  getComponentName(componentName) {
    return this.getMetadata(componentName).displayName;
  }

  getComponentMetadata(componentName) {
    return window.webbitRegistry.getMetadata(componentName);
  }

  sortAlphabetically(array, property) {
    return array.sort((a, b) => {
      if(a[property] < b[property]) { return -1; }
      if(a[property] > b[property]) { return 1; }
      return 0;
    });
  }

  firstUpdated() {
    this.componentCategories = this.getComponentCategories();
    window.webbitRegistry.whenAnyDefined(() => {
      this.componentCategories = this.getComponentCategories();
    });
  }

  getComponentCategories() {
    const categories = {};

    this.getComponents().forEach(name => {
      const { displayName, category } = this.getComponentMetadata(name);
      const categoryName = category.toLowerCase();
      if (categoryName in categories) {
        categories[categoryName].push({ displayName, name });
      } else {
        categories[categoryName] = [{ displayName, name }];
      }
    });

    // sort alphabetically
    return Object.keys(categories).sort().map(categoryName => {
      return {
        name: categoryName,
        components: this.sortAlphabetically(categories[categoryName], 'displayName')
      }
    });
  }

  onComponentSelect(name) {
    this.selectedComponent = name; 
    this.wom.removeNodePreview();
    this.wom.executeAction('addNode', {
      componentType: name
    });
  }

  renderSelectedComponent() {
    if (!this.selectedComponent) {
      return html`
        <div part="selected-component">
          <header>Selected component</header>
          <p>No component is currently selected.</p>
        </div>
      `;
    }

    const metadata = this.getComponentMetadata(this.selectedComponent);

    return html`
      <div part="selected-component">
        <header><span>${metadata.displayName}</span> component</header>
        <p>
          ${metadata.description}
          ${' '}
          ${metadata.documentationLink ? html`
            Examples and documentation can be found <a href="${metadata.documentationLink}" target="_blank">here</a>.
          ` : ''}
        </p>
      </div>
    `;
  }

  toggleShowComponentList() {
    this.showComponentList = !this.showComponentList;
  }

  renderComponentList() {
    return html`
      <vaadin-accordion opened="${null}">
        ${this.componentCategories.map(category => html`
          <vaadin-accordion-panel theme="small">
            <div part="category-name" slot="summary">${category.name}</div>
            <div part="component-list">
              ${category.components.map(component => html`
                <div 
                  part="component" 
                  @click="${() => this.onComponentSelect(component.name)}"
                  class="${this.selectedComponent === component.name ? 'selected' : ''}"
                >
                  ${component.displayName}
                </div>
              `)}
            </div>
          </vaadin-accordion-panel>
        `)}
      </vaadin-accordion>
    `;
  }

  render() {

    if (!this.selectedNode) {
      return html`Select an element to begin adding.`;
    }

    return html`
      <p>Add elements to <span>${this.selectedNode.getWebbitId()}</span></p>
      <div part="fields">
        <div part="components" style="position: relative">
          <vaadin-text-field
            label="Component"
            clear-button-visible 
            value="${this.sourceKeyInput || ''}"
            @change="${this.onSourceKeyInputChange}"
            theme="small"
          >
              <iron-icon 
                slot="suffix" 
                icon="vaadin:angle-down"
                style="cursor: pointer"
                @click="${this.toggleShowComponentList}"
              ></iron-icon>
          </vaadin-text-field>
          ${this.showComponentList ? html`
            <div part="components-list">
              ${this.renderComponentList()}
            </div>
          ` : ''}
        </div>
        <vaadin-combo-box
          part="slots"
          items='["a", "b"]'
          label="Slot"
          clear-button-visible 
          value="${this.sourceProviderInput || ''}"
          @change="${this.onSourceProviderInputChange}"
          theme="small"
        ></vaadin-combo-box>
      </div>
    `

    return html`
      <div part="all-components">
        <header>All Components</header>
        
      </div>
      ${this.renderSelectedComponent()}
    `;
  }
}

customElements.define('dashboard-components-tool', ComponentsTool);