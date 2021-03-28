import 'api-viewer-element';
import { LitElement, html, css } from 'lit-element';

class ApiViewer extends LitElement {


  static get properties() {
    return {
      tags: { type: Array, attribute: false },
      selected: { type: String, attribute: 'selected' },
      component: { type: String, attribute: 'component' }
    };
  }

  constructor() {
    super();
    this.tags = [];
    this.tagNames = [];
    this.selected = '';
    this.component = '';
  }

  hasTag(name) {
    return this.tagNames.indexOf(name) >= 0;
  }

  getConfig(name) {
    const dashboardConfig = webbitRegistry.getDashboardConfig(name);

    if (!dashboardConfig) {
      return null;
    }

    const properties = [];

    for (let propName in dashboardConfig.properties) {
      const propConfig = dashboardConfig.properties[propName];

      if (!propConfig.canConnectToSources || !propConfig.attribute || propConfig.editorOnly) {
        continue;
      }

      properties.push({
        name: propName,
        description: '',
        type: propConfig.type.name.toLowerCase(),
        attribute: propConfig.attribute,
        default: JSON.stringify(propConfig.defaultValue) || '',
      });
    }

    return {
      name,
      description: dashboardConfig.description,
      attributes: [],
      properties,
      events: [],
      slots: [],
      cssProperties: [],
      cssParts: [],
    };
  }

  addTag(name) {

    if (this.component && name !== this.component) {
      return;
    }

    if (this.hasTag(name) || !customElements.get(name)) {
      return;
    }

    const config = this.getConfig(name);

    if (config) {
      this.tags.push(config);
      this.tagNames.push(name);

      this.tags = this.tags.sort((tag1, tag2) => {
        return tag1.name.localeCompare(tag2.name);
      });
    }
  }

  firstUpdated() {

    webbitRegistry.getRegisteredNames().forEach(name => {
      this.addTag(name);
    });

    webbitRegistry.whenAnyDefined(name => {
      this.addTag(name);
    });
  }

  render() {
      return html`<api-viewer .elements="${this.tags}" selected="${this.selected}"></api-viewer>`;
  }
}

customElements.define('frc-api-viewer', ApiViewer);