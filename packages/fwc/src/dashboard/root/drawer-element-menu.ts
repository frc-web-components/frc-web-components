/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import FrcDashboard from '@dashboard/frc-dashboard';
import './drawer-sidebar';
import {
  dashboardContext,
  selectedElementContext,
} from '@dashboard/context-providers';
import { consume } from '@lit/context';
import removeElement from './remove-element';
import { appendElementToDashboard } from './get-element-html';
import getAllowedChildren from '@dashboard/get-allowed-children';

interface DashboardElement {
  selector: string;
  name: string;
}

@customElement('dashboard-drawer-element-menu')
export default class DashboardDrawer extends LitElement {
  @consume({ context: dashboardContext }) dashboard!: FrcDashboard;
  @property({ type: Object }) element!: HTMLElement;

  @consume({ context: selectedElementContext, subscribe: true })
  @state()
  selectedElement?: HTMLElement;

  static styles = css`
    :host {
      display: inline-block;
      position: absolute;
      top: -5px;
      right: 0;
    }
  `;

  get #allowedChildren(): string[] {
    const allowedChildren = getAllowedChildren(
      this.element,
      this.dashboard.getConnector()
    )?.[0]?.allowedChildren;
    return allowedChildren ?? [];
  }

  static createIcon() {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('icon', 'vaadin:ellipsis-dots-v');
    icon.setAttribute('theme', 'small');
    return icon;
  }

  #onItemSelected(event: CustomEvent) {
    const action = event.detail.value.action;
    if (typeof action === 'function') {
      action();
    }
  }

  #removeElement() {
    const nextElement = removeElement(
      this.element,
      this.dashboard.getConnector()
    );
    if (nextElement && this.element === this.selectedElement) {
      this.dashboard.setSelectedElement(nextElement);
    }
  }

  #selectElement() {
    this.dashboard.setSelectedElement(this.element);
  }

  #getAddableElements(): DashboardElement[] {
    const { dashboard } = this;
    if (!dashboard) {
      return [];
    }
    const selectors = this.#allowedChildren;
    return selectors
      .filter((selector) => {
        const config = dashboard.getConnector().getElementConfig(selector);
        return !!config;
      })
      .map((selector) => ({
        selector,
        name: dashboard.getSelectorDisplayName(selector),
      }))
      .sort((el1, el2) => el1.name.localeCompare(el2.name));
  }

  #addChild(selector: string) {
    appendElementToDashboard(
      this.dashboard.getConnector(),
      selector,
      this.element
    );
  }

  render(): TemplateResult {
    const displayName = this.dashboard.getElementDisplayName(this.element);

    const addableElements = this.#getAddableElements();

    const items = [
      {
        component: DashboardDrawer.createIcon(),
        children: [
          { text: displayName, disabled: true },
          { component: 'hr' },
          {
            text: 'Select',
            disabled: this.element === this.selectedElement,
            action: () => this.#selectElement(),
          },
          { text: 'Remove', action: () => this.#removeElement() },
          {
            text: `Add child...`,
            disabled: addableElements.length === 0,
            children: addableElements.map((element) => {
              return {
                text: element.name,
                action: () => this.#addChild(element.selector),
              };
            }),
          },
        ],
      },
    ];
    return html`
      <vaadin-menu-bar
        @item-selected="${this.#onItemSelected}"
        theme="icon small tertiary"
        .items="${items}"
      ></vaadin-menu-bar>
    `;
  }
}
