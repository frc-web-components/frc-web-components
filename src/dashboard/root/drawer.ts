/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import FrcDashboard from '../frc-dashboard';
import './drawer-sidebar';
import '../dashboard-components/element-editors/sources-editor';

@customElement('dashboard-drawer')
export default class DashboardDrawer extends LitElement {
  @property({ type: Object, attribute: false }) dashboard!: FrcDashboard;
  @state() selectedTabIndex = 0;
  @state() dragHandle = false;
  @state() drawerWidth = 300;

  static styles = css`
    :host {
      display: flex;
      position: absolute;
      top: 44px;
      left: 0;
      width: 300px;
      height: calc(100vh - 44px);
      overflow: hidden;
    }

    vaadin-tabs {
      background: #555;
    }

    vaadin-tab {
      color: #fff;
    }

    vaadin-tab[selected] {
      color: rgb(144, 200, 249);
    }

    .drawer-content {
      flex: 1;
    }

    .splitter {
      height: 100%;
      width: 8px;
      display: flex;
      background: green;
      align-items: center;
      padding: 2px;
      box-sizing: border-box;
      background: #2d3d52;
      cursor: ew-resize;
    }

    .handle {
      width: 100%;
      height: 50px;
      background: blue;
      border-radius: 4px;
      background: #5a6d85;
    }
  `;

  #onTabChange(ev: CustomEvent): void {
    this.selectedTabIndex = ev.detail.value;
  }

  firstUpdated() {
    document.addEventListener('mousemove', (ev) => {
      const flags = ev.buttons;
      // eslint-disable-next-line no-bitwise
      const isMouseUp = (flags & 1) === 1;

      if (!isMouseUp) {
        this.dragHandle = false;
      }

      if (this.dragHandle) {
        this.drawerWidth = ev.screenX;
        this.style.width = `${this.drawerWidth}px`;
      }
    });
  }

  render(): TemplateResult {
    return html`
      <div class="drawer-content">
        <vaadin-tabs
          .selected=${this.selectedTabIndex}
          @selected-changed=${this.#onTabChange}
          theme="small dark"
        >
          <vaadin-tab value=${0}>Components</vaadin-tab>
          <vaadin-tab value=${1}>Sources</vaadin-tab>
        </vaadin-tabs>
        ${this.selectedTabIndex === 0
          ? html`
              <dashboard-drawer-sidebar
                .dashboard=${this.dashboard}
              ></dashboard-drawer-sidebar>
            `
          : ''}
        ${this.selectedTabIndex === 1
          ? html`
              <dashboard-sources-editor
                .dashboard=${this.dashboard}
              ></dashboard-sources-editor>
            `
          : ''}
      </div>
      <div class="splitter">
        <div
          class="handle"
          @mousedown=${(ev: MouseEvent) => {
            this.dragHandle = true;
          }}
        ></div>
      </div>
    `;
  }
}
