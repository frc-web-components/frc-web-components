/* eslint-disable import/extensions */
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FrcDashboard as FrcDash } from './dashboard';
import addElements from './elements';
import addProviders from './source-providers';
import addThemes from './themes';
import addDashboardComponents from './dashboard/dashboard-components';

@customElement('frc-dashboard-builder')
export default class FrcDashboardBuilder extends LitElement {
  constructor() {
    super();
    const dashboard = new FrcDash();
    addElements(dashboard);
    addProviders(dashboard);
    addThemes(dashboard);
    addDashboardComponents(dashboard);
    const dashboardElement = document.createElement('dashboard-root');
    (dashboardElement as any).dashboard = dashboard;
    this.appendChild(dashboardElement);
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}
