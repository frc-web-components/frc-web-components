import 'api-viewer-element';
import { LitElement, html, css } from 'lit-element';

class ApiViewer extends LitElement {


  static get properties() {
    return {
      tags: { type: Array, attribute: false },
      component: { type: String, attribute: 'component' }
    };
  }

  constructor() {
    super();
    this.tags = [];
    this.tagNames = [];
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

      if (!propConfig.canConnectToSources || !propConfig.attribute) {
        continue;
      }

      properties.push({
        name: propName,
        description: '',
        type: propConfig.type.name.toLowerCase(),
        attribute: propConfig.attribute,
        default: JSON.stringify(propConfig.defaultValue || ''),
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

    if (this.component && this.component !== name) {
      return;
    }

    if (this.hasTag(name)) {
      return;
    }

    const config = this.getConfig(name);

    if (config) {
      this.tags.push(config);
      this.tagNames.push(name);
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
      return html`<api-viewer .elements="${this.tags}"></api-viewer>`;
  }
}

customElements.define('frc-api-viewer', ApiViewer);