import './icons';
import './theme';
import './vaadin';
import './ace-editor';
import { FrcDashboard } from '@frc-web-components/dashboard';
import './components/frc-dashboard';
import './components/frc-dashboard-builder';

export default function createDashboard(
  element: HTMLElement,
  dashboardElementName = 'dashboard-root'
): FrcDashboard {
  const dashboard = new FrcDashboard();
  const dashboardElement = document.createElement(dashboardElementName);
  (dashboardElement as any).dashboard = dashboard;
  element.appendChild(dashboardElement);
  return dashboard;
}
