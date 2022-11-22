import './icons';
import './ace-editor';
import { FrcDashboard } from './dashboard';
import './frc-dashboard';
import './frc-dashboard-builder';

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
