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
      selectedTabName: { type: String, attribute: false },
      selectedNode: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedTab = 0;
    this.selectedTabName = '';
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

    if (changedProps.has('selectedNode')) {

      const editorTabs = this.getEditorTabs();

      const tabIndex = editorTabs.indexOf(this.selectedTabName);
      this.selectedTab = Math.max(0, tabIndex);
      this.selectedTabName = editorTabs[this.selectedTab];
    }
  }

  onTabChange(ev) {
    const target = ev.target || ev.path[0];
    this.selectedTab = target.selected;

    const editorTabs = this.getEditorTabs();

    this.selectedTabName = editorTabs[this.selectedTab]; 

    const event = new CustomEvent('dashboardToolsTabChange', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  getEditorTabs() {
    return this.selectedNode && this.selectedNode.getDashboardConfig()
      ? this.selectedNode.getDashboardConfig().editorTabs
      : ['addElements', 'properties', 'sources'];
  }

  renderSelectedTab() {
    const editorTabs = this.getEditorTabs();

    const tabName = editorTabs[this.selectedTab];

    if (tabName === 'addElements') {
      return html`
        <dashboard-components-tool
          .selectedNode="${this.selectedNode}"
          .wom="${this.wom}"
        ></dashboard-components-tool>
      `;
    } else if (tabName === 'properties') {
      return html`
        <dashboard-properties-tool 
          .selectedNode="${this.selectedNode}"
          .wom="${this.wom}"
        ></dashboard-properties-tool>
      `;
    } else if (tabName === 'sources') {
      return html`
        <dashboard-sources-tool 
          .selectedNode="${this.selectedNode}"
          .wom="${this.wom}"
        ></dashboard-sources-tool>
      `;
    } else {
      return null;
    }
  }

  render() {

    const editorTabs = this.getEditorTabs();

    return html`
      <vaadin-tabs 
        theme="small" 
        selected="${this.selectedTab}" 
        @selected-changed="${this.onTabChange}"
      >
        ${editorTabs.map(tabName => {
          if (tabName === 'addElements') {
            return html`<vaadin-tab>Add Elements</vaadin-tab>`;
          } else if (tabName === 'properties') {
            return html`<vaadin-tab>Properties</vaadin-tab>`;
          } else if (tabName === 'sources') {
            return html`<vaadin-tab>Sources</vaadin-tab>`;
          } else {
            return null;
          }
        })}
      </vaadin-tabs>
      <div part="tab-content">
        ${this.renderSelectedTab()}
      </div>
    `;
  }
}

customElements.define('dashboard-tools-bottom', DashboardToolsBottom);