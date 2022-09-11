import {
  LitElement, html, css, TemplateResult,
} from 'lit';
import './dashboard-tab';
import './navbar';
import './drawer';
import { WebbitConnector } from '@webbitjs/webbit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { onRemoveKeyPress } from '../hotkeys';
import { dashboardProvider } from '../context-providers';
import FrcDashboard from '../frc-dashboard';

export function removeElement(element: HTMLElement, connector: WebbitConnector):
  HTMLElement | null {
  const parent = element.parentElement;
  const siblings = [...parent?.children ?? []];
  const elementIndex = siblings.indexOf(element);
  const nextElement = siblings[elementIndex + 1] ?? siblings[elementIndex - 1] ?? parent;
  element?.remove();
  const isInDashboard = (
    connector.getRootElement().contains(nextElement)
    && nextElement !== connector.getRootElement()
  );
  return isInDashboard ? (nextElement as HTMLElement) : null;
}

const styles = css`
  :host {
    display: flex;
    flex-direction: row;
    font-family: sans-serif;
    font-size: 16px;
    width: 100vw;
    overflow: hidden;
  }

  .layout {
    width: 100%;
    box-sizing: border-box;
    display: flex;
  }

  .layout.closed dashboard-drawer {
    display: none;
  }

  dashboard-drawer {
    width: 570px;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1;
    height: 100vh;
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

@customElement('dashboard-root')
export default class DashboardRoot extends LitElement {
  @state() drawerOpened = true;
  @state() ready = false;
  @property({ type: Object, attribute: false }) dashboard?: FrcDashboard;

  static styles = styles;

  constructor() {
    super();
    this.drawerOpened = true;
    document.body.style.margin = '0';
  }

  get #selectedElement(): HTMLElement | null {
    return this.dashboard?.getSelectedElement() ?? null;
  }

  async firstUpdated(): Promise<void> {
    if (!this.dashboard) {
      return;
    }

    dashboardProvider.setProvider(this, this.dashboard);

    this.dashboard.addElements({
      'dashboard-tab': {
        dashboard: {
          topLevel: false,
          displayName: element => element.getAttribute('tab-name') || 'Tab',
          layout: {
            type: 'absolute',
            movable: false,
            resizable: {
              horizontal: false,
              vertical: false,
            },
          },
        },
        properties: {
          tabName: { type: 'String', attribute: 'tab-name', reflect: true },
        },
        slots: [
          { name: '' },
        ],
      },
    });
    const rootElement = this.dashboard.getRootElement();
    rootElement.setAttribute('slot', 'dashboard');
    this.append(rootElement);
    this.dashboard.resetHtml();

    onRemoveKeyPress(() => {
      if (this.#selectedElement) {
        if (this.dashboard) {
          if (this.#selectedElement.tagName !== 'DASHBOARD-TAB') {
            const nextElement = removeElement(this.#selectedElement, this.dashboard.getConnector());
            if (nextElement) {
              this.dashboard.setSelectedElement(nextElement);
            }
          }
        }
      }
    });

    this.dashboard.subscribe('elementSelect', () => this.requestUpdate());
    this.dashboard.showLayer('elementPreviewLayer');
    this.dashboard.showLayer('absolutePositionLayout');
    const elementPreviewLayer = this.dashboard.getLayerElement('elementPreviewLayer');
    const absolutePositionLayout = this.dashboard.getLayerElement('absolutePositionLayout');
    if (elementPreviewLayer) {
      this.append(elementPreviewLayer);
    }
    if (absolutePositionLayout) {
      this.append(absolutePositionLayout);
    }
    this.ready = true;
  }

  updated(updatedProps: Map<string, unknown>): void {
    if (updatedProps.has('drawerOpened')) {
      if (this.drawerOpened) {
        this.dashboard?.openDrawer();
      } else {
        this.dashboard?.closeDrawer();
      }
    }
  }

  #onDrawerToggle(): void {
    this.drawerOpened = !this.drawerOpened;
    this.dashboard?.setPreviewedElement(null);
    const layout = this.renderRoot.querySelector('.layout') as HTMLElement;
    const drawer = this.renderRoot.querySelector('dashboard-drawer') as HTMLElement;
    if (this.drawerOpened && layout && drawer) {
      layout.classList.remove('closed');
    } else {
      layout.classList.add('closed');
    }
  }

  render(): TemplateResult {
    if (!this.ready) {
      return html``;
    }
    return html`
      <div class="layout">
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
      </div>
    `;
  }
}
