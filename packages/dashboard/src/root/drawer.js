import { LitElement, html, css } from "lit";
import { dashboardProvider } from '../context-providers';
import './top-drawer-tabs';
import './bottom-drawer-tabs';

class DashboardDrawer extends LitElement {

  static styles = css`

    :host {
      display: block;
    }

    vaadin-split-layout {
      height: 100vh;
      max-height: 100vh;
      position: relative;
    }
  `;

  static properties = {
    dashboard: { state: true },
  }

  constructor() {
    super();
    dashboardProvider.addConsumer(this);
  }

  firstUpdated() {
    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());

    const topArea = this.renderRoot.querySelector('dashboard-top-drawer-tabs');
    const bottomArea = this.renderRoot.querySelector('dashboard-bottom-drawer-tabs');
    const { height } = this.getBoundingClientRect();
    topArea.style.flex = `1 1 ${height * .3}px`;
    bottomArea.style.flex = `1 1 ${height * .7}px`;
  }

  render() {
    return html`
      <vaadin-split-layout orientation="vertical" theme="small" class="drawer-areas">
        <dashboard-top-drawer-tabs></dashboard-top-drawer-tabs>
        <dashboard-bottom-drawer-tabs></dashboard-bottom-drawer-tabs>
      </vaadin-split-layout>
    `;
  }
}

customElements.define('dashboard-drawer', DashboardDrawer);
