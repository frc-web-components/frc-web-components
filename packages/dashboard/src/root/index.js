import { LitElement, html, css } from 'lit';
import './dashboard-tab';
import './navbar';
import './drawer';
import { onRemoveKeyPress } from '../hotkeys';
import { dashboardProvider } from '../context-providers';

function removeElement(element, connector) {
  const parent = element.parentElement;
  const siblings = [...parent.children];
  const elementIndex = siblings.indexOf(element);
  const nextElement = siblings[elementIndex + 1] ?? siblings[elementIndex - 1] ?? parent;
  element?.remove();
  const isInDashboard = (
    connector.getRootElement().contains(nextElement)
    && nextElement !== connector.getRootElement()
  );
  return isInDashboard ? nextElement : null;
}

const styles = css`
  :host {
    display: flex;
    flex-direction: row;
    font-family: sans-serif;
    font-size: 16px;
    width: 100%;
    overflow: hidden;
  }

  vaadin-split-layout {
    width: 100%;
    box-sizing: border-box;
  }

  vaadin-split-layout.closed dashboard-drawer {
    max-width: 0;
  }

  vaadin-split-layout.closed::part(splitter) {
    display: none;
  }

  dashboard-drawer {
    width: 440px;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    width: 100%;
    oveflow: auto;
  }

  .dashboard-elements {
    width: 100%;
    overflow: auto;
    flex: 1;
  }

  #container {
    position: relative;
    width: calc(100vw - 16px);
    height: 100%;
    box-sizing: border-box;
  }

  ::slotted([slot=dashboard]) {
    width: 100%;
    height: 100%;
  }

  ::slotted([slot=layer]) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
  }
`;

class DashboardRoot extends LitElement {

  static styles = styles;

  static properties = {
    dashboard: { type: Object, attribute: false },
    drawerOpened: { state: true },
    ready: { state: true }
  };

  constructor() {
    super();
    this.drawerOpened = true;
    document.body.style.margin = '0';
  }

  get #selectedElement() {
    return this.dashboard.getSelectedElement();
  }

  async firstUpdated() {
    dashboardProvider.setProvider(this, this.dashboard);

    this.dashboard.addElements({
      'dashboard-tab': {
        dashboard: {
          topLevel: false,
          displayName: element => element.getAttribute('tab-name') || 'Tab',
          layout: {
            type: 'absolute',
            movable: false,
            resizable: false,
          }
        },
        properties: {
          tabName: { type: 'String', attribute: 'tab-name', reflect: true }
        },
        slots: [
          { name: '' },
        ],
      }
    });
    const rootElement = this.dashboard.getRootElement();
    rootElement.setAttribute('slot', 'dashboard');
    this.append(rootElement);
    this.dashboard.resetHtml();

    onRemoveKeyPress(() => {
      if (this.#selectedElement) {
        const nextElement = removeElement(this.#selectedElement, this.dashboard.getConnector());
        this.dashboard.setSelectedElement(nextElement);
      }
    });

    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());
    this.dashboard.showLayer('elementPreviewLayer');
    this.dashboard.showLayer('absolutePositionLayout');
    this.append(
      this.dashboard.getLayerElement('elementPreviewLayer')
    );
    this.append(
      this.dashboard.getLayerElement('absolutePositionLayout')
    );
    this.ready = true;
  }

  updated(updatedProps) {
    if (updatedProps.has('drawerOpened')) {
      if (this.drawerOpened) {
        this.dashboard.openDrawer();
      } else {
        this.dashboard.closeDrawer();
      }
    }
  }

  #onDrawerToggle() {
    this.drawerOpened = !this.drawerOpened;
    this.dashboard.setPreviewedElement(null);
    const splitter = this.renderRoot.querySelector('vaadin-split-layout');
    const drawer = this.renderRoot.querySelector('dashboard-drawer');
    if (this.drawerOpened) {
      splitter.classList.remove('closed');
      drawer.style.width = '400px';
      drawer.flex = 'auto';
    } else {
      splitter.classList.add('closed');
    }
  }

  render() {
    if (!this.ready) {
      return html``;
    }
    return html`
      <vaadin-split-layout orientation="horizontal" theme="small" class="drawer-areas">
        <dashboard-drawer .interact="${null}"></dashboard-drawer>
        <div class="dashboard">
          <dashboard-navbar @drawerToggle=${this.#onDrawerToggle}></dashboard-navbar>
          <div class="dashboard-elements">
            <div id="container">
              <slot name="dashboard"></slot>
              <slot name="layer"></slot>
            </div>
          </div>
        </div>
      </vaadin-split-layout>
    `;
  }
}

customElements.define('dashboard-root', DashboardRoot);