/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import FrcDashboard from '@dashboard/frc-dashboard';
import './drawer-sidebar';
import { dashboardContext } from '@dashboard/context-providers';
import { consume } from '@lit/context';

@customElement('dashboard-drawer-element-menu')
export default class DashboardDrawer extends LitElement {
  @consume({ context: dashboardContext }) dashboard!: FrcDashboard;
  @property({ type: Object }) element!: HTMLElement;

  static styles = css`
    :host {
      display: inline-block;
      position: absolute;
      top: -5px;
      right: 0;
    }
  `;

  static createIcon() {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('icon', 'vaadin:ellipsis-dots-v');
    icon.setAttribute('theme', 'small');
    return icon;
  }

  render(): TemplateResult {
    const displayName = this.dashboard.getElementDisplayName(this.element);
    const items = [
      {
        component: DashboardDrawer.createIcon(),
        children: [
          { text: displayName, disabled: true },
          { text: 'Select' },
          { text: 'Remove' },
          {
            text: 'Add',
            children: [
              {
                text: 'hello',
              },
              { text: 'bye' },
            ],
          },
        ],
      },
    ];
    return html`
      <vaadin-menu-bar
        theme="icon small tertiary"
        .items="${items}"
      ></vaadin-menu-bar>
    `;
  }
}
