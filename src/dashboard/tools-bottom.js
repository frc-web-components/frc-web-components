import { LitElement, html, css } from 'lit-element';
import './sources/sources-tool';
import './components/components-tool';

class DashboardToolsBottom extends LitElement {

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      vaadin-tabs {
        background: rgba(200,200,200,.3);
        box-shadow: none;
      }

      vaadin-tab {
        color: #555;
      }

      [part=tab-content] {
        overflow: auto;
        flex: 1;
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
      <div part="tab-content">
        ${this.selectedTab === 0 ? html`
        <dashboard-components-tool></dashboard-components-tool>
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
      </div>
    `;
  }
}

customElements.define('dashboard-tools-bottom', DashboardToolsBottom);