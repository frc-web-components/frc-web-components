import { FrcDashboard } from '../dashboard';
import addDashboardComponentsPlugin from './dashboard-components';

export default function addPlugins(dashboard: FrcDashboard): void {
  addDashboardComponentsPlugin(dashboard);
}

export const addDashboardComponents = addDashboardComponentsPlugin;
