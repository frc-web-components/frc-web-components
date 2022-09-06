import { LitElement, html, css } from "lit";
import { dashboardProvider } from '../context-providers';

class DashboardNavbar extends LitElement {

  static styles = css`

    :host {
      display: flex;
      width: 100%;
      background: rgb(250, 250, 250);
      height: 44px;
    }

    vaadin-drawer-toggle {
      height: 44px;
    }

    vaadin-tabs {
      height: 44px;
      min-height: 44px;
    }

    vaadin-tab {
      height: 44px;
    }

    .navbar {
      display: flex; 
      justify-content: space-between; 
      width: 100%;
      flex: 1;
    }

    .tabs {
      display: flex;
    }

    .add-tab-button {
      cursor: pointer;
      margin: 0;
      height: 100%;
    }
  
    .nt-connection {
      align-self: center; 
      padding-right: 15px;
    }
  
    .nt-connection span.connected {
      color: green;
    }
  
    .nt-connection span.disconnected {
      color: red;
    }
  `;

  static properties = {
    ntConnected: { state: true },
    dashboard: { state: true },
    selectedTabIndex: { state: true },
  }

  constructor() {
    super();
    this.ntConnected = false;
    this.selectedTabIndex = 0;
    dashboardProvider.addConsumer(this);
  }

  get #selectedElement() {
    return this.dashboard.getSelectedElement();
  }

  get #rootElement() {
    return this.dashboard.getConnector().getRootElement();
  }

  #updateSelectedTab() {
    const index = [...this.#rootElement.querySelectorAll('dashboard-tab')].findIndex(tab => {
      return tab === this.#selectedElement || tab.contains(this.#selectedElement);
    })
    this.selectedTabIndex = index;
  }

  #showSelectedTab() {
    [...this.#rootElement.querySelectorAll('dashboard-tab')].forEach((tab, index) => {
      if (index === this.selectedTabIndex) {
        tab.setAttribute('selected', '');
      } else {
        tab.removeAttribute('selected');
      }
    });
  }

  #onTabChange(ev) {
    const tab = [...this.#rootElement.children][ev.detail.value];
    if (tab && !tab.contains(this.#selectedElement)) {
      this.dashboard.setSelectedElement(tab);
    }
  }

  #onAddTab() {
    const tabCount = this.#rootElement.querySelectorAll('dashboard-tab').length;
    const tab = this.dashboard.addTab(`Tab ${tabCount + 1}`);
    if (tabCount === 0) {
      this.dashboard.setSelectedElement(tab);
    }
  }

  #updateIfTab(element) {
    if (element.tagName.toLowerCase() === 'dashboard-tab') {
      const connector = this.dashboard.getConnector();
      connector.getElementWebbit(element)?.subscribe(() => this.requestUpdate());
      this.requestUpdate();
    }
  }

  firstUpdated() {
    NetworkTables.addRobotConnectionListener(connected => {
      this.ntConnected = connected;
    }, true);
    const connector = this.dashboard.getConnector();
    [...this.#rootElement.querySelectorAll('dashboard-tab')]
      .forEach(element => this.#updateIfTab(element));
    connector.subscribeElementConnected(({ element }) => this.#updateIfTab(element));
    connector.subscribeElementDisconnected(({ element }) => this.#updateIfTab(element));
    this.dashboard.subscribe('drawerToggle', () => this.requestUpdate());
    this.dashboard.subscribe('elementSelect', () => {
      this.#updateSelectedTab();
    });
  }

  updated(changedProps) {
    if (changedProps.has('selectedTabIndex')) {
      this.#showSelectedTab();
    }
  }

  #getTabs() {
    return [...this.#rootElement.querySelectorAll('dashboard-tab')].map(tab => {
      return {
        label: tab.getAttribute('tab-name'),
      };
    });
  }

  #onToggleClick() {
    const event = new CustomEvent('drawerToggle', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    const tabs = this.#getTabs();

    return html`
      <vaadin-drawer-toggle @click=${this.#onToggleClick}></vaadin-drawer-toggle>
      <div class="navbar">
        <div class="tabs">
          <vaadin-tabs .selected=${this.selectedTabIndex} @selected-changed=${this.#onTabChange}>
            ${tabs.map(({ label }, index) => html`
            <vaadin-tab value=${index}>${label}</vaadin-tab>
            `)}
          </vaadin-tabs>
          <vaadin-button class="add-tab-button" theme="icon tertiary" aria-label="Add Tab" @click=${this.#onAddTab}
            ?disabled=${!this.dashboard.isDrawerOpened()}>
            <vaadin-icon icon="vaadin:plus"></vaadin-icon>
          </vaadin-button>
        </div>
        <div class="nt-connection">
          NetworkTables:
          <span class=${this.ntConnected ? 'connected' : 'disconnected' }>
            ${this.ntConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-navbar', DashboardNavbar);
