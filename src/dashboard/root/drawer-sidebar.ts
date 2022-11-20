/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';
import FrcDashboard from '../frc-dashboard';
import { appendElementToDashboard } from './get-element-html';

interface DashboardElement {
  selector: string;
  name: string;
}

@customElement('dashboard-drawer-sidebar')
export default class DashboardDrawerSidebar extends LitElement {
  @property({ type: Object }) dashboard!: FrcDashboard;
  @state() groups: string[] = [];
  @state() newElementSelector?: string;
  @state() selectedGroup = 'My Elements';
  @state() selectedElement?: HTMLElement;

  static styles = css`
    :host {
      font-family: sans-serif;
      font-size: 15px;
      width: 200px;
      height: 100vh;
      background: #444;
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      overflow: auto;
      box-sizing: border-box;
      color: white;
    }

    header {
      text-transform: uppercase;
      margin-bottom: 10px;
      font-size: 18px;
      color: lightblue;
    }

    p {
      margin: 0 0 5px;
      cursor: grab;
      line-height: 18px;
    }

    p:hover {
      font-weight: bold;
    }

    p.selected {
      font-weight: bold;
    }

    .group-selector {
      margin-bottom: 10px;
      padding: 3px 1px;
      font-size: 16px;
    }

    .add-button {
      border: 1px solid #aaa;
      color: white;
      background: none;
      border-radius: 4px;
      padding: 3px 5px;
      cursor: pointer;
    }

    .demo-button {
      color: rgb(187, 187, 255);
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
      margin-bottom: 5px;
      padding: 1px;
    }

    .no-children-warning span {
      font-weight: bold;
    }
  `;

  get #allowedChildren(): string[] {
    const allowedChildren =
      this.dashboard?.getAllowedChildren()?.[0]?.allowedChildren;
    return allowedChildren ?? [];
  }

  #appendToDashboard(): void {
    if (this.selectedElement && this.newElementSelector) {
      appendElementToDashboard(
        this.dashboard.getConnector(),
        this.newElementSelector,
        this.selectedElement
      );
    }
  }

  getGroups(): string[] {
    const { dashboard } = this;
    if (!dashboard) {
      return [];
    }
    const selectors = this.#allowedChildren;
    const groups: string[] = selectors.map((selector) => {
      const config = dashboard.getConnector().getElementConfig(selector);
      if (!config) {
        return '';
      }
      return config.group;
    });
    return [...new Set(groups)].filter((group) => group !== '').sort();
  }

  firstUpdated(): void {
    this.dashboard.subscribe('elementSelect', () => {
      this.selectedElement = this.dashboard.getSelectedElement() ?? undefined;
    });
    this.selectedElement = this.dashboard.getSelectedElement() ?? undefined;
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('selectedElement')) {
      this.groups = this.getGroups();
      if (!this.groups.includes(this.selectedGroup)) {
        this.selectedGroup = this.groups[0] ?? this.selectedGroup;
      }
      this.newElementSelector = this.getElements()[0]?.selector;
    }
    if (changedProps.has('selectedGroup')) {
      const selectedElementGroup =
        this.getElementConfig()?.group ?? this.groups[0];
      if (selectedElementGroup !== this.selectedGroup) {
        this.newElementSelector = this.getElements()[0]?.selector;
      }
    }
  }

  getElementConfig(): WebbitConfig | undefined {
    return this.dashboard
      ?.getConnector()
      .getMatchingElementConfig(this.selectedElement);
  }

  getElements(): DashboardElement[] {
    const { dashboard } = this;
    if (!dashboard) {
      return [];
    }
    const selectors = this.#allowedChildren;
    return selectors
      .filter((selector) => {
        const config = dashboard.getConnector().getElementConfig(selector);
        if (!config) {
          return false;
        }
        return config.group === this.selectedGroup;
      })
      .map((selector) => ({
        selector,
        name: dashboard.getSelectorDisplayName(selector),
      }))
      .sort((el1, el2) => el1.name.localeCompare(el2.name));
  }

  #getSelectedElementName(): string {
    const { selectedElement } = this;
    if (!selectedElement) {
      return '';
    }
    return this.dashboard?.getElementDisplayName(selectedElement) ?? '';
  }

  render(): TemplateResult {
    const isEditable = this.dashboard.isElementEditable();
    return html`
      <header>Elements</header>
      <select
        class="group-selector"
        ?disabled=${this.groups.length === 0 || !isEditable}
        @change=${(ev: any) => {
          this.selectedGroup = ev.target.value;
        }}
      >
        ${this.groups.map(
          (group) => html`
            <option value=${group} ?selected=${group === this.selectedGroup}>
              ${group}
            </option>
          `
        )}
      </select>
      ${this.#renderChildren()}
    `;
  }

  #renderChildren(): TemplateResult {
    const isEditable = this.dashboard.isElementEditable();
    if (!isEditable) {
      return html`
        <p class="no-children-warning">
          No children can be added to a tutorial
        </p>
      `;
    }
    return html`
      ${this.getElements().length === 0
        ? html`
            <p class="no-children-warning">
              No children can be added to element
              <span>${this.#getSelectedElementName()}</span>
            </p>
          `
        : null}
      ${this.getElements().map(
        ({ selector, name }) => html`
          <p
            class="${this.newElementSelector === selector ? 'selected' : ''}"
            key=${selector}
            draggable="true"
            @dragstart=${(event: DragEvent) => {
              const img = document.createElement('img');
              img.src =
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              event.dataTransfer?.setDragImage(img, 0, 0);
              this.dashboard.publish('dragNewElementStart', {
                selector,
                event,
              });
            }}
            @dragend=${(event: Event) =>
              this.dashboard.publish('dragNewElementEnd', { event })}
            @click=${() => {
              this.newElementSelector = selector;
            }}
          >
            ${name}
          </p>
          ${this.newElementSelector === selector
            ? html`
                ${this.renderDemo()}
                <div style="margin-bottom: 8px">
                  <button class="add-button" @click=${this.#appendToDashboard}>
                    Prepend
                  </button>
                  <button class="add-button" @click=${this.#appendToDashboard}>
                    Append
                  </button>
                </div>
              `
            : null}
        `
      )}
    `;
  }

  renderDemo(): TemplateResult {
    if (!this.newElementSelector) {
      return html``;
    }
    const tutorials = this.dashboard.getElementTutorials(
      this.newElementSelector
    );
    if (tutorials.length === 0) {
      return html``;
    }
    return html`
      <button
        class="demo-button"
        @click=${() => {
          this.dashboard.showTutorial(tutorials[0].id);
        }}
      >
        Demo element
      </button>
    `;
  }
}
