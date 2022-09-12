import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dashboardProvider } from '../context-providers';
import FrcDashboard from '../frc-dashboard';
import './drawer-sidebar';

@customElement('dashboard-drawer')
export default class DashboardDrawer extends LitElement {
  @state() dashboard!: FrcDashboard;
  @state() selectedElement?: HTMLElement;

  static styles = css`
    :host {
      display: block;
    }

    .dashboard {
      display: flex;
    }

    .editors {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 370px;
      gap: 10px;
      font-family: sans-serif;
      padding: 10px;
      background: rgb(240, 240, 240);
      box-sizing: border-box;
    }

    .editors header {
      font-weight: bold;
    }

    .editors-header {
      font-size: 18px;
      color: purple;
    }
  `;

  constructor() {
    super();
    dashboardProvider.addConsumer(this);
  }

  firstUpdated(): void {
    this.dashboard.subscribe('elementSelect', () => {
      this.selectedElement = this.dashboard?.getSelectedElement() ?? undefined;
    });
  }

  render(): TemplateResult {
    return html`
      <div class="dashboard">
        <dashboard-drawer-sidebar
          .dashboard=${this.dashboard}
        ></dashboard-drawer-sidebar>
        <div class="editors">
          ${this.selectedElement
            ? html`
                <div style="margin: 5px 0 10px">
                  <header class="editors-header">
                    ${this.dashboard?.getElementDisplayName(
                      this.selectedElement
                    )}
                  </header>
                </div>
                <div>
                  <header>Element Tree</header>
                  ${this.renderElementTree()}
                </div>
              `
            : null}
          <div>
            <header>Properties</header>
            <dashboard-properties-editor
              style="padding: 7px 10px 10px"
              .dashboard=${this.dashboard}
            ></dashboard-properties-editor>
          </div>
          <div>
            <header>Sources</header>
            <dashboard-sources-editor
              .dashboard=${this.dashboard}
              style="padding: 7px 10px 10px"
            ></dashboard-sources-editor>
          </div>
        </div>
      </div>
    `;
  }

  renderElementTree(): TemplateResult {
    if (!this.selectedElement) {
      return html``;
    }
    const selectedTab = this.selectedElement.closest('dashboard-tab');
    return html`
      <dashboard-element-tree-node
        style="padding: 7px 10px 10px 0"
        .element=${selectedTab}
        .dashboard=${this.dashboard}
        expanded
      ></dashboard-element-tree-node>
    `;
  }
}
