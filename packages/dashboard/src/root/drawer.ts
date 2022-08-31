import {
  LitElement, html, css, TemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';
import { dashboardProvider } from '../context-providers';
import './top-drawer-tabs';
import './bottom-drawer-tabs';
import FrcDashboard from '../frc-dashboard';
import getElementHtml from './get-element-html';

interface DashboardElement {
  selector: string;
  name: string;
}

@customElement('dashboard-drawer')
export default class DashboardDrawer extends LitElement {
  @state() dashboard?: FrcDashboard;
  @state() groups: string[] = [];
  @state() newElementSelector?: string;
  @state() selectedGroup = 'My Elements';
  @state() selectedElement?: HTMLElement;

  static styles = css`
    :host {
      display: block;
    }

    .dashboard {
      display: flex;
    }
    
    .sidebar {
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
    
    .sidebar header {
      text-transform: uppercase;
      margin-bottom: 10px;
      font-size: 18px;
      color: lightblue;
    }
    
    .sidebar p {
      margin: 0 0 5px;
      cursor: pointer;
    }
    
    .sidebar p:hover {
      font-weight: bold;
    }
    
    .sidebar p.selected {
      font-weight: bold;
      cursor: default;
    }
    
    .editors {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 370px;
      gap: 10px;
      font-family: sans-serif;
      padding: 10px;
      background: rgb(240, 240, 240);
      box-sizing: border-box;
    }
    
    .editors header {
      font-weight: bold;
    }
    
    .group-selector {
      margin-bottom: 10px;
      padding: 3px 1px;
      font-size: 16px;
    }

    .editors-header {
      font-size: 18px;
      color: purple;
    }

    .add-button {
      border: 1px solid #aaa;
      color: white;
      background: none;
      border-radius: 4px;
      padding: 3px 5px;
      cursor: pointer;
    }

    .no-children-warning span {
      font-weight: bold;
    }
  `;

  constructor() {
    super();
    dashboardProvider.addConsumer(this);
  }

  get #allowedChildren(): string[] {
    const allowedChildren = this.dashboard?.getAllowedChildren()?.[0]?.allowedChildren;
    return allowedChildren ?? [];
  }

  #appendToDashboard(): void {
    const selector = this.newElementSelector;
    if (!this.dashboard || !selector) {
      return;
    }
    // if (!this.element || !this.dashboard || !this.newElementSelector) {
    //   return;
    // }
    // this.element.appendChild(this.dashboard.getRootElement());
    // this.dashboard?.getRootElement().childNodes.forEach(node => node.remove());
    // const element = document.createElement(this.newElementSelector);
    // this.dashboard?.getRootElement().appendChild(element);
    // this.dashboard.setSelectedElement(element);
    const container = document.createElement('div');
    container.innerHTML = getElementHtml(this.dashboard.getConnector(), selector);
    [...container.children].forEach(child => {
      // if (!this._slot) {
      //   child.removeAttribute('slot');
      // } else {
      //   child.setAttribute('slot', this._slot);
      // }
      this.selectedElement?.append(child);
    });
  }

  getGroups(): string[] {
    const { dashboard } = this;
    if (!dashboard) {
      return [];
    }
    const selectors = this.#allowedChildren;
    const groups: string[] = selectors
      .map(selector => {
        const config = dashboard.getConnector().getElementConfig(selector);
        if (!config) {
          return '';
        }
        return config.group;
      });
    return [...new Set(groups)].filter(group => group !== '').sort();
  }

  firstUpdated(): void {
    if (this.dashboard) {
      this.dashboard.subscribe('elementSelect', () => {
        this.selectedElement = this.dashboard?.getSelectedElement() ?? undefined;
      });
    }
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('selectedElement')) {
      this.groups = this.getGroups();
      this.selectedGroup = this.groups[0] ?? '';
      this.newElementSelector = this.getElements()[0]?.selector;
    }
    if (changedProps.has('selectedGroup')) {
      const selectedElementGroup = this.getElementConfig()?.group ?? this.groups[0];
      if (selectedElementGroup !== this.selectedGroup) {
        this.newElementSelector = this.getElements()[0]?.selector;
      }
    }
  }

  getElementConfig(): WebbitConfig | undefined {
    return this.dashboard?.getConnector().getMatchingElementConfig(this.selectedElement);
  }

  getElements(): DashboardElement[] {
    const { dashboard } = this;
    if (!dashboard) {
      return [];
    }
    const selectors = this.#allowedChildren;
    return selectors
      .filter(selector => {
        const config = dashboard.getConnector().getElementConfig(selector);
        if (!config) {
          return false;
        }
        return config.group === this.selectedGroup;
      })
      .map(selector => ({
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
    if (!this.dashboard) {
      return html``;
    }
    return html`
      <div class="dashboard">
        <div class="sidebar">
          <header>Elements</header>
          <select class="group-selector" ?disabled=${this.groups.length === 0} @change=${(ev: any) => {
            this.selectedGroup = ev.target.value;
          }}>
            ${this.groups.map(group => html`
            <option value=${group} ?selected=${group === this.selectedGroup}>${group}</option>
            `)}
          </select>
          ${this.getElements().length === 0 ? html`
            <p class="no-children-warning">
              No children can be added to element <span>${this.#getSelectedElementName()}</span>
            </p>
          ` : null}
          ${this.getElements().map(({ selector, name }) => html`
            <p class=${this.newElementSelector === selector ? 'selected' : ''} key=${selector} @click=${() => {
              this.newElementSelector = selector;
            }}
              >
              ${name}
            </p>
            ${this.newElementSelector === selector ? html`
              <div style="margin-bottom: 8px">
                <button 
                  class="add-button"
                  @click=${this.#appendToDashboard}
                >Prepend</button>
                <button class="add-button" @click=${this.#appendToDashboard}>Append</button>
              </div>
            ` : null}
          `)}
        </div>
        <div class="editors">
          ${this.selectedElement ? html`  
            <div style="margin: 5px 0 10px">
              <header class="editors-header">
                ${this.dashboard?.getElementDisplayName(this.selectedElement)}
              </header>
              ${this.renderBreadcrumbs()}
            </div>
              ${this.selectedElement.childElementCount > 0 ? html` 
              <div>
                <header>Element Tree</header>
                <dashboard-element-tree-node
                  style="padding: 7px 10px 10px 0"
                  .element=${this.selectedElement}
                  .dashboard=${this.dashboard}
                  expanded
                ></dashboard-element-tree-node>
              </div>
            ` : null}
          ` : null}
          <div>
            <header>Properties</header>
            <dashboard-properties-editor 
              style="padding: 7px 10px 10px"
              .dashboard=${this.dashboard}
            ></dashboard-properties-editor>
          </div>
          <div>
            <header>Sources</header>
            <dashboard-sources-editor 
              .dashboard=${this.dashboard}
              style="padding: 7px 10px 10px"
            ></dashboard-sources-editor>
          </div>
        </div>
      </div>
    `;
  }

  private renderBreadcrumbs(): TemplateResult {
    const { dashboard, selectedElement } = this;
    if (!dashboard || !selectedElement) {
      return html``;
    }
    const breadCrumbs: HTMLElement[] = [selectedElement];
    let currentElement: HTMLElement | null = selectedElement;
    while (currentElement && currentElement.tagName.toLowerCase() !== 'dashboard-tab') {
      currentElement = currentElement.parentElement;
      if (currentElement) {
        breadCrumbs.push(currentElement);
      }
    }

    if (breadCrumbs.length < 2) {
      return html``;
    }

    return html`
      <div style="width: 100%; overflow: auto;">
        <div 
          style="display: flex; margin: 5px 0 2px; color: #333; font-size: 14px; align-items: center;"
        >
          ${breadCrumbs.reverse().map((element, index) => {
            const displayName = dashboard.getElementDisplayName(element);
            if (index === breadCrumbs.length - 1) {
              return html`
                <span 
                  class="breadcrumb-name"
                  style="display: inline-block; white-space: nowrap;"
                >${displayName}</span>
              `;
            }
            return html`
              <span 
                class="breadcrumb-name"
                style="display: inline-block; white-space: nowrap; cursor: pointer;"
                @click=${() => dashboard.setSelectedElement(element)}
              >${displayName}</span>
              <span 
                class="breadcrumb-separator"
                style="margin: 0 5px; font-size: 12px; color: #555;"
              >></span>
            `;
          })}
        </div>
      </div>
    `;
  }
}
