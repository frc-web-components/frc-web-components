import { LitElement, html, css } from 'lit-element';
import './sources-tool';

class DashboardToolsBottom extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }

      vaadin-tabs {
        background: rgba(200,200,200,.3);
        box-shadow: none;
      }

      vaadin-tab {
        color: #555;
      }
    `;
  }

  static get properties() {
    return {
      selectedTab: { type: Number, attribute: false },
      selectedNode: { type: Object, attribute: false }
    };
  }

  constructor() {
    super();
    this.selectedTab = 0;
    this.selectedNode = null;
  }

  onTabChange(ev) {
    const target = ev.target || ev.path[0];
    this.selectedTab = target.selected;
  }

  render() {
    return html`
      <vaadin-tabs 
        theme="small" 
        selected="${this.selectedTab}" 
        @selected-changed="${this.onTabChange}"
      >
        <vaadin-tab>Components</vaadin-tab>
        <vaadin-tab>Properties</vaadin-tab>
        <vaadin-tab>Sources</vaadin-tab>
        <vaadin-tab>Styles</vaadin-tab>
      </vaadin-tabs>
      ${this.selectedTab === 0 ? html`
        Components
      ` : ''}

      ${this.selectedTab === 1 ? html`
        Properties
      ` : ''}

      ${this.selectedTab === 2 ? html`
        <dashboard-sources-tool .selectedNode="${this.selectedNode}"></dashboard-sources-tool>
      ` : ''}

      ${this.selectedTab === 3 ? html`
        Styles
      ` : ''}
    `;
  }
}

customElements.define('dashboard-tools-bottom', DashboardToolsBottom);