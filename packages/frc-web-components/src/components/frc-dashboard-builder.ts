/* eslint-disable import/extensions */
import { html, LitElement, TemplateResult } from 'lit';
import { FrcDashboard as FrcDash } from '@frc-web-components/dashboard';
import { customElement } from 'lit/decorators.js';
import addPlugins from '@frc-web-components/plugins';

@customElement('frc-dashboard-builder')
export default class FrcDashboardBuilder extends LitElement {
  constructor() {
    super();
    const dashboard = new FrcDash();
    addPlugins(dashboard);
    const dashboardElement = document.createElement('dashboard-root');
    (dashboardElement as any).dashboard = dashboard;
    this.appendChild(dashboardElement);
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}
