import { FrcDashboard } from './dashboard';
import { Nt4Provider, GamepadProvider } from './source-providers';
import { dashboardElementConfigs } from './components';
import './elements/vaadin';
import { darkTheme } from './themes';

const dashboard = new FrcDashboard();
const dashboardElement = document.createElement('dashboard-root');
(dashboardElement as any).dashboard = dashboard;

dashboard.addThemeRules('dark', darkTheme);
dashboard.addSourceProvider('NetworkTables', new Nt4Provider());
dashboard.addSourceProvider('Gamepad', new GamepadProvider());
dashboard.setDefaultSourceProvider('NetworkTables');
dashboard.addElements(dashboardElementConfigs, 'FRC');
document.body.appendChild(dashboardElement);
