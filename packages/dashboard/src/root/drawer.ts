/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dashboardProvider } from '../context-providers';
import FrcDashboard from '../frc-dashboard';
import './drawer-sidebar';

@customElement('dashboard-drawer')
export default class DashboardDrawer extends LitElement {
  @state() dashboard!: FrcDashboard;
  @state() selectedElement?: HTMLElement;
  @state() editors: HTMLElement[] = [];
  @state() editorOpened: Record<string, boolean> = {};

  static styles = css`
    :host {
      display: block;
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
  `;

  constructor() {
    super();
    dashboardProvider.addConsumer(this);
  }

  firstUpdated(): void {
    this.dashboard.subscribe('elementSelect', () => {
      this.selectedElement = this.dashboard.getSelectedElement() ?? undefined;
    });
    this.selectedElement = this.dashboard.getSelectedElement() ?? undefined;
  }

  updated(updatedProps: Map<string, unknown>): void {
    if (updatedProps.has('selectedElement')) {
      this.#updateEditors();
    }
  }

  #getEditorTags(): string[] {
    return this.dashboard.getComponentIdsOfType('elementEditor');
  }

  #updateEditors(): void {
    this.editors.forEach((editor) => {
      editor.remove();
      this.dashboard.unmount(editor);
    });
    const tags = this.#getEditorTags();
    const editorComponents =
      this.renderRoot.querySelector('.editor-components');
    tags.forEach((tag) => {
      const isOpened = this.editorOpened[tag] ?? true;
      const editor = this.dashboard.create('elementEditor', tag);
      if (editor) {
        const container = document.createElement('details');
        container.addEventListener('toggle', (ev) => {
          const { open } = ev?.target as HTMLDetailsElement;
          this.editorOpened = {
            ...this.editorOpened,
            [tag]: open,
          };
        });
        if (isOpened) {
          container.setAttribute('open', '');
        }
        container.innerHTML = `
          <summary>
            <span class="caret">
              <vaadin-icon icon="vaadin:angle-right" class="closed-cursor"></vaadin-icon>
              <vaadin-icon icon="vaadin:angle-down" class="opened-cursor"></vaadin-icon>
            </span>
            ${tag}
          </summary>`;
        container.appendChild(editor);
        editorComponents?.append(container);
        this.editors.push(container);
      }
    });
  }

  render(): TemplateResult {
    const isEditable = this.dashboard.isElementEditable();
    return html`
      <div class="dashboard">
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
          <div class="editor-components">${this.renderElementTree()}</div>
        </div>
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
