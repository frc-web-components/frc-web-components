import './icons';
import './ace-editor';
import { FrcDashboard } from './dashboard';
import './frc-dashboard';
import './frc-dashboard-builder';
import addElements from './elements';
import addProviders from './source-providers';
import addTutorials from './tutorials';
import addThemes from './themes';
import addDashboardComponents from './dashboard/dashboard-components';

export default function createDashboard(
  element: HTMLElement,
  dashboardElementName = 'dashboard-root'
): FrcDashboard {
  const dashboard = new FrcDashboard();
  addElements(dashboard);
  addProviders(dashboard);
  addTutorials(dashboard);
  addThemes(dashboard);
  addDashboardComponents(dashboard);
  const dashboardElement = document.createElement(dashboardElementName);
  (dashboardElement as any).dashboard = dashboard;
  element.appendChild(dashboardElement);
  return dashboard;
}
