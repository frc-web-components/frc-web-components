/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult, render } from 'lit';
import './dashboard-tab';
import './navbar';
import './drawer';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { onRemoveKeyPress } from '../hotkeys';
import { dashboardProvider } from '../context-providers';
import FrcDashboard from '../frc-dashboard';
import './source-picker-dialog';
import removeElement from './remove-element';

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
    height: 100%;
    width: 100vw;
    box-sizing: border-box;
  }

  ::slotted([slot='dashboard']) {
    width: 100%;
    height: 100%;
    background: var(--dashboard-background, white);
  }

  ::slotted([slot='layer']) {
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
  @state() dialogOpened = false;
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
          displayName: (element) => element.getAttribute('tab-name') || 'Tab',
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
        slots: [{ name: '' }],
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
            const nextElement = removeElement(
              this.#selectedElement,
              this.dashboard.getConnector()
            );
            if (nextElement) {
              this.dashboard.setSelectedElement(nextElement);
            }
          }
        }
      }
    });

    Object.entries(this.dashboard.getLayers()).forEach(([_, layerElement]) => {
      this.appendChild(layerElement);
    });

    this.dashboard.subscribe('layerAdd', (value: any) => {
      this.appendChild(value.layer);
    });

    const navbar = document.createElement('dashboard-navbar');
    (navbar as any).dashboard = this.dashboard;
    navbar.setAttribute('slot', 'navbar');
    navbar.addEventListener('drawerToggle', () => {
      this.#onDrawerToggle();
    });
    this.appendChild(navbar);

    this.dashboard.subscribe('themeSet', () => this.#updateTheme());
    this.#updateTheme();

    this.dashboard.subscribe('sourcesDialogOpen', () => {
      this.dialogOpened = true;
    });

    this.ready = true;
  }

  #updateTheme(): void {
    const navbar = this.querySelector('dashboard-navbar');
    const theme = this.dashboard?.getTheme() ?? '';
    navbar?.setAttribute('data-theme', theme);
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
    const drawer = this.renderRoot.querySelector(
      'dashboard-drawer'
    ) as HTMLElement;
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
    const isEditable = this.dashboard?.isElementEditable();
    return html`
      <div class="layout">
        <vaadin-dialog
          theme="no-padding"
          draggable
          modeless
          resizable
          .opened=${this.drawerOpened && this.dialogOpened}
          .renderer=${guard([], () => (root: HTMLElement) => {
            render(
              html`
                <dashboard-source-picker-dialog
                  .dashboard=${this.dashboard}
                  .dialogOpened=${this.dialogOpened}
                  @closeDialog=${() => {
                    this.dialogOpened = false;
                  }}
                ></dashboard-source-picker-dialog>
              `,
              root
            );
          })}
        ></vaadin-dialog>
        <dashboard-drawer .interact="${null}"></dashboard-drawer>
        <div class="dashboard">
          <slot name="navbar"></slot>
          <div class="dashboard-elements">
            <div id="container">
              <slot name="dashboard"></slot>
              ${isEditable ? html` <slot name="layer"></slot> ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
