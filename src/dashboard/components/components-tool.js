import { LitElement, html, css } from 'lit-element';

class ComponentsTool extends LitElement {

  static get styles() {
    return css`

      :host {
        display: flex;
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

    document.addEventListener("dragover", ev => {
      // prevent default to allow drop
      ev.preventDefault();

      if ('__WOM_NODE__' in ev.target) {
        ev.target.__WOM_NODE__.onMove(ev);
      }      
    }, false);

    document.addEventListener("dragenter", ev => {
      if ('__WOM_NODE__' in ev.target) {
        ev.target.__WOM_NODE__.onEnter();
      }      
    }, false);

    document.addEventListener("dragleave", ev => {
      
      if ('__WOM_NODE__' in ev.target) {
        ev.target.__WOM_NODE__.onLeave();
      }      
    }, false);

    document.addEventListener("dragend", ev => { 
      if ('__WOM_NODE__' in ev.target) {
        ev.target.__WOM_NODE__.onAdd();
      }      
      this.wom.deselectNode();
    }, false);
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
    this.wom.selectAction('addNode', {
      componentType: name
    });
  }

  onDragStart(ev, name) {
    this.onComponentSelect(name);
    const dragImage = document.createElement('div');
    dragImage.innerText = '+';
    dragImage.style.fontSize = '25px';
    dragImage.style.fontStyle = 'bold';
    dragImage.style.width = '30px';
    dragImage.style.height = '30px';
    dragImage.style.display = 'black';
    dragImage.style.lineHeight = '30px';
    dragImage.style.textAlign = 'center';
    dragImage.style.color = 'white';
    dragImage.style.background = 'green';
    dragImage.style.borderRadius = '50%';
    dragImage.style.position = 'absolute';
    dragImage.style.left = '-1000000px';
    dragImage.style.top = '-1000000px';
    dragImage.style.display = 'block';
    document.body.appendChild(dragImage);
    ev.dataTransfer.setDragImage(dragImage, 0, 0);
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

  render() {
    return html`
      <div part="all-components">
        <header>All Components</header>
        <vaadin-accordion opened="${null}">
          ${this.componentCategories.map(category => html`
            <vaadin-accordion-panel theme="small">
              <div part="category-name" slot="summary">${category.name}</div>
              <div part="component-list">
                ${category.components.map(component => html`
                  <div 
                    part="component" 
                    @click="${() => this.onComponentSelect(component.name)}"
                    @dragstart="${(ev) => this.onDragStart(ev, component.name)}"
                    class="${this.selectedComponent === component.name ? 'selected' : ''}"
                    draggable="true"
                  >
                    ${component.displayName}
                  </div>
                `)}
              </div>
            </vaadin-accordion-panel>
          `)}
        </vaadin-accordion>
      </div>
      ${this.renderSelectedComponent()}
    `;
  }
}

customElements.define('dashboard-components-tool', ComponentsTool);