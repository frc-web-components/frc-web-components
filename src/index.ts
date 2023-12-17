import './icons';
import './ace-editor';
import { FrcDashboard as Dashboard } from './dashboard';
import './frc-dashboard';
import './frc-dashboard-builder';
import addElements from './elements';
import addProviders from './source-providers';
import addThemes from './themes';
import addDashboardComponents from './dashboard/dashboard-components';
import './components/line-chart';
import { KeyValueStore } from './store';

export default function createDashboard(
  element: HTMLElement,
  dashboardElementName = 'dashboard-root'
): Dashboard {
  const dashboard = new Dashboard();
  addElements(dashboard);
  addProviders(dashboard);
  addThemes(dashboard);
  addDashboardComponents(dashboard);
  const dashboardElement = document.createElement(dashboardElementName);
  (dashboardElement as any).dashboard = dashboard;
  element.appendChild(dashboardElement);
  return dashboard;
}

const store = new KeyValueStore();

store.set('/a', 3);

console.log('storeValue:\n', JSON.stringify(store.getJson(''), null, 2));

// store.delete('/a/b/c');

store.set('/a/b/c', 'test');
console.log('storeValue:\n', JSON.stringify(store.getJson(''), null, 2));

export type FrcDashboard = Dashboard;
