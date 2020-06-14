import { LitElement, html, css } from 'lit-element';

class ComponentsTool extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
      }

      header {
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
        margin-top: 25px;
      }

      [part=all-components] header {
        margin-bottom: 8px;
        text-transform: uppercase;
        font-size: 15px;
      }

      [part=component] {
        color: #333;
        cursor: pointer;
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
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      componentCategories: { type: Array, attribute: false },
      selectedComponent: { type: String, attribute: false }
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.componentCategories = [];
    this.selectedComponent = '';
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
    this.wom.selectAction('addNode', {
      componentType: name
    });
  }

  renderSelectedComponent() {
    if (!this.selectedComponent) {
      return html`
        <p>No component is currently selected.</p>
      `;
    }

    const metadata = this.getComponentMetadata(this.selectedComponent);

    return html`
      <header><span>${metadata.displayName}</span> component</header>
      <p>
        ${metadata.description}
        ${' '}
        ${metadata.documentationLink ? html`
          Examples and documentation can be found <a href="${metadata.documentationLink}" target="_blank">here</a>.
        ` : ''}
      </p>
    `;
  }

  render() {
    return html`
      ${this.renderSelectedComponent()}
      <div part="all-components">
        <header>All Components</header>
        <vaadin-accordion>
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
      </div>

    `;
  }
}

customElements.define('dashboard-components-tool', ComponentsTool);