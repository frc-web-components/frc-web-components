import './icons';
import './theme';
import './vaadin';
import './ace-editor';
import { html, render } from 'lit';
import { FrcDashboard } from '@frc-web-components/dashboard';
import addPlugins from '@frc-web-components/plugins';

export default function createDashboard(element: HTMLElement): FrcDashboard {
  const dashboard = new FrcDashboard();
  addPlugins(dashboard);

  render(
    html`<dashboard-root .dashboard=${dashboard}></dashboard-root>`,
    element,
  );
  return dashboard;
}