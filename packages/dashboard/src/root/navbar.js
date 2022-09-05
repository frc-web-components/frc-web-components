import { LitElement, html, css } from "lit";
import { dashboardProvider } from '../context-providers';
import {removeElement} from './index';

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
    let tabCount;
    const tab = document.createElement('dashboard-tab');
    const tabs = this.#getTabs();
    for (tabCount = 0; tabCount <= tabs.length; tabCount++) { // iterate over label number 0 - # of tabs (incl new one)
      let foundLabel =false;
      for (let j = 0; j < tabs.length; j++) { // iterate over tabs, look for one matching label #
        if(tabs[j].label === `Tab ${tabCount+1}`) {
          foundLabel = true;
          break;
        }
      }
      if(!foundLabel) {
        break; 
      }
    }
    tab.setAttribute('tab-name', `Tab ${tabCount + 1}`);
    tab.setAttribute('slot', 'tab');
    this.#rootElement.append(tab);
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

  deleteTab(name) {
    const tabs = [...this.#rootElement.querySelectorAll('dashboard-tab')];
    let tab;
    let newSelectedTab;
    for (let i = 0; i < tabs.length; i++) {
      let tabName = tabs[i].getAttribute("tab-name");
      if(tabName && tabName === name) {
        tab = tabs[i];
        console.log(tab);
        if (i-1 >= 0) {
          newSelectedTab = tabs[i-1];
        }
        else if (i+1 <= tabs.length) {
          newSelectedTab = tabs[i+1];
        }
        else {
          newSelectedTab = null;
        }
        break;
      }
    }
    if (tab === null) {
      return;
    }
    console.log("newSelected", newSelectedTab);
    const nextElement = removeElement(tab, this.dashboard.getConnector());
    if (newSelectedTab !== null) {
      console.log("newSelected", newSelectedTab);
      this.dashboard.setSelectedElement(newSelectedTab);
    } 
    this.#showSelectedTab();

  }

  render() {
    const tabs = this.#getTabs();

    return html`
      <vaadin-drawer-toggle @click=${this.#onToggleClick}></vaadin-drawer-toggle>
      <div class="navbar">
        <div class="tabs">
          <vaadin-tabs .selected=${this.selectedTabIndex} @selected-changed=${this.#onTabChange}>
            ${tabs.map(({ label }, index) => html`
            <vaadin-tab value=${index}>${label} 
              <vaadin-button class="delete-tab-button" theme="icon tertiary" aria-label="Delete Tab" deletes=${label} @click=${()=>this.deleteTab(label)}
              ?disabled=${!this.dashboard.isDrawerOpened()}>
              <vaadin-icon icon="vaadin:close"></vaadin-icon>
            </vaadin-tab>
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
