import './icons';
import './theme';
import './vaadin';
import './ace-editor';
import { html, render } from 'lit';
// import * as lit from 'lit';
// import addPlugins from './plugins';
import { FrcDashboard } from '@frc-web-components/dashboard';
import addPlugins from '@frc-web-components/plugins';

export default function renderDashboard(element: HTMLElement): { dashboard: FrcDashboard } {
  const dashboard = new FrcDashboard();
  addPlugins(dashboard);

  render(
    html`<dashboard-root .dashboard=${dashboard}></dashboard-root>`,
    element,
  );
  return { dashboard };
}
