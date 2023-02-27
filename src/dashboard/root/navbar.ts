/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult, render } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import FrcDashboard from '../frc-dashboard';
import removeElement from './remove-element';
import './settings-dialog';

@customElement('dashboard-navbar')
export class DashboardNavbar extends LitElement {
  @state() ntConnected = false;
  @state() nt4Address = '127.0.0.1';
  @state() selectedTabIndex = 0;
  @state() settingsDialogOpened = false;
  @property({ type: Object }) dashboard!: FrcDashboard;

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      background: var(--dashboard-navbar-background, rgb(250, 250, 250));
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

    .info {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      padding-right: 15px;
      align-items: end;
      gap: 4px;
      line-height: normal;
      font-size: 14px;
      text-align: end;
    }

    .settings {
      color: var(--lumo-primary-text-color, blue);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
    }

    .settings vaadin-icon {
      width: 14px;
      height: 14px;
    }

    .nt-connection {
      color: var(--lumo-contrast, black);
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
    }

    .nt-connection.connected span {
      color: green;
    }

    .nt-connection.disconnected span {
      color: red;
    }

    .nt-connection.connected .dot {
      width: 14px;
      height: 14px;
      background-color: rgb(137, 255, 0);
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 7px 1px,
        rgb(48, 71, 1) 0px -1px 2px inset, rgb(137, 255, 0) 0px 0px 8px;
    }

    .nt-connection.disconnected .dot {
      width: 14px;
      height: 14px;
      background-color: rgb(255, 0, 0);
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 7px 1px,
        rgb(48, 71, 1) 0px -1px 2px inset, red 0px 0px 8px;
    }
  `;

  get #selectedElement(): HTMLElement | null {
    return this.dashboard.getSelectedElement();
  }

  get #rootElement(): HTMLElement {
    return this.dashboard.getConnector().getRootElement();
  }

  #updateSelectedTab(): void {
    const index = [
      ...this.#rootElement.querySelectorAll('dashboard-tab'),
    ].findIndex(
      (tab) =>
        tab === this.#selectedElement || tab.contains(this.#selectedElement)
    );
    this.selectedTabIndex = index;
  }

  #showSelectedTab(): void {
    [...this.#rootElement.querySelectorAll('dashboard-tab')].forEach(
      (tab, index) => {
        if (index === this.selectedTabIndex) {
          tab.setAttribute('selected', '');
        } else {
          tab.removeAttribute('selected');
        }
      }
    );
  }

  #onTabChange(ev: CustomEvent): void {
    const tab = [...this.#rootElement.children][ev.detail.value];
    if (tab && !tab.contains(this.#selectedElement)) {
      this.dashboard.setSelectedElement(tab as HTMLElement);
    }
  }

  #onAddTab(): void {
    const tabCount = this.#rootElement.querySelectorAll('dashboard-tab').length;
    const tab = this.dashboard.addTab(`Tab ${tabCount + 1}`);
    if (tabCount === 0) {
      this.dashboard.setSelectedElement(tab);
    }
  }

  #updateIfTab(element: HTMLElement): void {
    if (element.tagName.toLowerCase() === 'dashboard-tab') {
      const connector = this.dashboard.getConnector();
      connector
        .getElementWebbit(element)
        ?.subscribe(() => this.requestUpdate());
      this.requestUpdate();
    }
  }

  firstUpdated(): void {
    const ntProvider = this.dashboard
      .getStore()
      .getSourceProvider('NetworkTables');
    (ntProvider as any).addConnectionListener(
      (connected: boolean, nt4Address: string) => {
        this.ntConnected = connected;
        this.nt4Address = nt4Address;
      },
      true
    );
    const connector = this.dashboard.getConnector();
    [...this.#rootElement.querySelectorAll('dashboard-tab')].forEach(
      (element) => this.#updateIfTab(element as HTMLElement)
    );
    connector.subscribeElementConnected((value: any) =>
      this.#updateIfTab(value.element)
    );
    connector.subscribeElementDisconnected((value: any) =>
      this.#updateIfTab(value.element)
    );
    this.dashboard.subscribe('drawerToggle', () => this.requestUpdate());
    this.dashboard.subscribe('elementSelect', () => {
      this.#updateSelectedTab();
    });
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('selectedTabIndex')) {
      this.#showSelectedTab();
    }
  }

  #getTabs(): { element: HTMLElement; label: string | null }[] {
    return [...this.#rootElement.querySelectorAll('dashboard-tab')].map(
      (tab) => ({
        element: tab as HTMLElement,
        label: tab.getAttribute('tab-name'),
      })
    );
  }

  #onToggleClick(): void {
    const event = new CustomEvent('drawerToggle', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  deleteTab(element: HTMLElement): void {
    const tab: HTMLElement = element;
    if (tab === null) {
      return;
    }
    const nextElement = removeElement(tab, this.dashboard.getConnector());
    if (nextElement) {
      this.dashboard.setSelectedElement(nextElement);
    }
    this.#showSelectedTab();
  }

  render(): TemplateResult {
    const tabs = this.#getTabs();

    return html`
      <vaadin-dialog
        theme="no-padding"
        @opened-changed=${(e: CustomEvent) => {
          this.settingsDialogOpened = e.detail.value;
        }}
        .opened=${this.settingsDialogOpened}
        .renderer=${guard([], () => (root: HTMLElement) => {
          render(
            html`
              <dashboard-settings-dialog
                .dashboard=${this.dashboard}
                .dialogOpened=${this.settingsDialogOpened}
                @closeDialog=${() => {
                  this.settingsDialogOpened = false;
                }}
              ></dashboard-settings-dialog>
            `,
            root
          );
        })}
      ></vaadin-dialog>
      <vaadin-drawer-toggle
        @click=${this.#onToggleClick}
      ></vaadin-drawer-toggle>
      <div class="navbar">
        <div class="tabs">
          <vaadin-tabs
            .selected=${this.selectedTabIndex}
            @selected-changed=${this.#onTabChange}
          >
            ${tabs.map(
              ({ element, label }, index) => html`
            <vaadin-tab value=${index}>${label} 
              <vaadin-button class="delete-tab-button" theme="icon tertiary" aria-label="Delete Tab"  @click=${() =>
                this.deleteTab(element)}
              ?disabled=${!this.dashboard.isDrawerOpened()}>
              <vaadin-icon icon="vaadin:close" style="width:20px;height:20px;cursor:pointer"></vaadin-icon>
            </vaadin-tab>
            `
            )}
          </vaadin-tabs>
          <vaadin-button
            class="add-tab-button"
            theme="icon tertiary"
            aria-label="Add Tab"
            @click=${this.#onAddTab}
            ?disabled=${!this.dashboard.isDrawerOpened()}
          >
            <vaadin-icon icon="vaadin:plus"></vaadin-icon>
          </vaadin-button>
        </div>
        <div class="info">
          <div
            class=${`nt-connection ${
              this.ntConnected ? 'connected' : 'disconnected'
            }`}
          >
            <div class="dot"></div>
            <span>${this.nt4Address}</span>
          </div>
          <div
            class="settings"
            @click=${() => {
              this.settingsDialogOpened = true;
            }}
          >
            <vaadin-icon icon="vaadin:cog"></vaadin-icon>
            Settings
          </div>
        </div>
      </div>
    `;
  }
}
