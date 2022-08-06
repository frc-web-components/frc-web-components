import { LitElement, html, css } from 'lit';
import { dashboardProvider } from '../context-providers';

class BottomDrawerTabs extends LitElement {

  currentTab;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100px;
      flex: 1;
    }

    .current-editor {
      flex: 1;
      overflow: auto;
    }

    .current-editor > div {
      height: 100%;
    }

    .tabs {
      background: rgb(243, 243, 243);
      box-shadow: none;
    }

    .current-tab {
      flex: 1;
    }
    
    .current-tab > div {
      height: 100%;
    }
  `;

  static properties = {
    selectedTab: { state: true },
    dashboard: { state: true },
  };

  constructor() {
    super();
    this.selectedTab = null;
    dashboardProvider.addConsumer(this);
  }

  #selectedTabChanged(ev) {
    this.selectedTab = this.#tabs[ev.detail.value];
  }

  get #tabs() {
    return this.dashboard.getComponentIdsOfType('bottomDrawerTab');
  }

  #updateSelectedTab() {
    if (!this.#tabs.includes(this.selectedTab)) {
      this.selectedTab = this.#tabs[0];
    }
  }

  #updateCurrentEditor() {
    if (this.currentTab) {
      this.currentTab.remove();
      this.dashboard.unmount(this.currentTab);
    }
    this.currentTab = this.dashboard.create('bottomDrawerTab', this.selectedTab);
    this.renderRoot.querySelector('.current-tab').append(this.currentTab);
  }

  updated(changedProps) {
    if (changedProps.has('selectedTab')) {
      this.#updateCurrentEditor();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.currentTab) {
      this.dashboard.unmount(this.currentTab);
    }
  }

  firstUpdated() {
    this.dashboard.subscribe('elementSelect', () => {
      this.#updateSelectedTab();
    });
    this.#updateSelectedTab();
  }

  render() {
    const tabs = this.#tabs;

    return html`
      <vaadin-tabs theme="small minimal" class="tabs" @selected-changed=${this.#selectedTabChanged} selected=${tabs.indexOf(this.selectedTab)}>
        ${tabs.map(tab => html`
        <vaadin-tab>${tab}</vaadin-tab>
        `)}
      </vaadin-tabs>
      <div class="current-tab"></div>
    `;
  }
}

customElements.define('dashboard-bottom-drawer-tabs', BottomDrawerTabs);