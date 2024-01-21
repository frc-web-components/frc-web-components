/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import FrcDashboard from '@dashboard/frc-dashboard';
import './drawer-sidebar';
import {
  dashboardContext,
  selectedElementContext,
  selectElmentChildrenContext,
} from '@dashboard/context-providers';
import { consume } from '@lit/context';
import './drawer-element-menu';

@customElement('dashboard-drawer')
export default class DashboardDrawer extends LitElement {
  @consume({ context: dashboardContext }) dashboard!: FrcDashboard;

  @consume({ context: selectedElementContext, subscribe: true })
  @state()
  selectedElement?: HTMLElement;

  @consume({ context: selectElmentChildrenContext, subscribe: true })
  @state()
  selectedElementChildren: HTMLElement[] = [];

  @state() editors: HTMLElement[] = [];
  @state() editorOpened: Record<string, boolean> = {};
  @state() showSidebar = true;
  @state() dragging = false;

  static styles = css`
    :host {
      display: block;
      position: relative;
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
      padding: 10px 0;
      background: rgb(240, 240, 240);
      box-sizing: border-box;
    }

    .editors.uneditable {
      display: none;
    }

    details summary + * {
      padding: 0 5px;
      box-sizing: border-box;
    }

    details .opened-cursor {
      display: none;
      width: 15px;
      margin-right: 3px;
    }

    details .closed-cursor {
      display: inline-block;
      width: 15px;
      margin-right: 3px;
    }

    .editors summary {
      font-weight: bold;
      list-style: none;
    }

    details[open] > summary .opened-cursor {
      display: inline-block;
    }

    details[open] > summary .closed-cursor {
      display: none;
    }

    .editors-header {
      font-size: 18px;
      color: purple;
      margin: 5px 0 10px;
      padding: 0 10px;
    }

    .editor-components {
      padding: 0 10px;
      flex: 1;
      overflow: auto;
    }

    .editor-components details {
      margin-bottom: 15px;
    }

    details > summary {
      list-style: none;
    }

    details > summary::marker,
    details > summary::-webkit-details-marker {
      display: none;
    }

    .resize-handle {
      height: 100vh;
      width: 4px;
      cursor: col-resize;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 100;
    }

    .hide-sidebar .resize-handle {
      position: fixed;
      left: 0;
      right: auto;
    }

    .hide-sidebar dashboard-drawer-sidebar {
      display: none;
    }
    .hide-sidebar .editors {
      display: none;
    }
  `;

  #renderPropertiesEditor(element?: HTMLElement, open = true) {
    const displayName = element
      ? this.dashboard.getElementDisplayName(element)
      : '';

    return html`
      <div style="position: relative;">
        <details ?open=${open}>
          <summary>
            <span class="caret">
              <vaadin-icon
                icon="vaadin:angle-right"
                class="closed-cursor"
              ></vaadin-icon>
              <vaadin-icon
                icon="vaadin:angle-down"
                class="opened-cursor"
              ></vaadin-icon>
            </span>

            <span style="color: purple">${displayName}</span> Properties
          </summary>
          <dashboard-properties-editor .element=${element}>
          </dashboard-properties-editor>
        </details>
        <dashboard-drawer-element-menu
          .element=${element}
        ></dashboard-drawer-element-menu>
      </div>
    `;
  }

  #renderPropertyEditors() {
    return html`
      ${this.#renderPropertiesEditor(this.selectedElement)}
      ${this.selectedElementChildren.map((child) =>
        this.#renderPropertiesEditor(child as HTMLElement, false)
      )}
    `;
  }

  render(): TemplateResult {
    const isEditable = this.dashboard.isElementEditable();
    return html`
      <div class="dashboard ${!this.showSidebar ? 'hide-sidebar' : ''}">
        <dashboard-drawer-sidebar
          .dashboard=${this.dashboard}
        ></dashboard-drawer-sidebar>
        <div class="editors ${!isEditable ? 'uneditable' : ''}">
          ${this.selectedElement
            ? html`
                <header class="editors-header">
                  ${this.dashboard?.getElementDisplayName(this.selectedElement)}
                </header>
              `
            : null}
          <div class="editor-components">
            ${this.renderElementTree()} ${this.#renderPropertyEditors()}
          </div>
        </div>
        <div
          class="resize-handle"
          draggable="true"
          @drag=${(ev: DragEvent) => {
            if (ev.screenX === 0 && ev.screenY === 0) {
              return;
            }
            this.showSidebar = ev.screenX > 270;
          }}
        ></div>
      </div>
    `;
  }

  renderElementTree(): TemplateResult {
    if (!this.selectedElement) {
      return html``;
    }
    const selectedTab = this.selectedElement.closest('dashboard-tab');
    return html`
      <details open>
        <summary>
          <span class="caret">
            <vaadin-icon
              icon="vaadin:angle-right"
              class="closed-cursor"
            ></vaadin-icon>
            <vaadin-icon
              icon="vaadin:angle-down"
              class="opened-cursor"
            ></vaadin-icon>
          </span>
          Element Tree
        </summary>
        <dashboard-element-tree-node
          .element=${selectedTab}
          .dashboard=${this.dashboard}
          expanded
        ></dashboard-element-tree-node>
      </details>
    `;
  }
}
