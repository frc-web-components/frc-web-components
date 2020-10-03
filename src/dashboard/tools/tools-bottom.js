import { LitElement, html, css } from 'lit-element';
import '../sources/sources-tool';
import '../components/components-tool';
import '../properties/properties-tool';
import '../properties/styles-tool';

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
      wom: { type: Object },
      selectedTab: { type: Number, attribute: false },
      selectedNode: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedTab = 0;
    this.selectedNode = null;
  }

  updated(changedProps) {
    if (changedProps.has('wom') && this.wom) {
      const callback = () => {
        this.selectedNode = this.wom.getSelectedNode();
      };
      this.wom.addListener('womNodeSelect', callback);
      this.wom.addListener('womNodeDeselect', callback);
    }
  }

  onTabChange(ev) {
    const target = ev.target || ev.path[0];
    this.selectedTab = target.selected;

    const event = new CustomEvent('dashboardToolsTabChange', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <vaadin-tabs 
        theme="small" 
        selected="${this.selectedTab}" 
        @selected-changed="${this.onTabChange}"
      >
        <vaadin-tab>Add Elements</vaadin-tab>
        <vaadin-tab>Properties</vaadin-tab>
        <vaadin-tab>Sources</vaadin-tab>
        <vaadin-tab>Styles</vaadin-tab>
      </vaadin-tabs>
      <div part="tab-content">
        ${this.selectedTab === 0 ? html`
        <dashboard-components-tool
          .selectedNode="${this.selectedNode}"
          .wom="${this.wom}"
        ></dashboard-components-tool>
        ` : ''}

        ${this.selectedTab === 1 ? html`
        <dashboard-properties-tool 
          .selectedNode="${this.selectedNode}"
          .wom="${this.wom}"
        ></dashboard-properties-tool>
        ` : ''}

        ${this.selectedTab === 2 ? html`
          <dashboard-sources-tool 
            .selectedNode="${this.selectedNode}"
            .wom="${this.wom}"
          ></dashboard-sources-tool>
        ` : ''}

        ${this.selectedTab === 3 ? html`
          <dashboard-styles-tool 
            .selectedNode="${this.selectedNode}"
            .wom="${this.wom}"
          ></dashboard-styles-tool>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('dashboard-tools-bottom', DashboardToolsBottom);