import { FrcDashboard } from '@frc-web-components/dashboard';
import addDashboardComponentsPlugin from './dashboard-components';
import addFrcPlugin from './frc';
import addFrcSimPlugin from './frc-sim';
import addVaadinElementsPlugin from './vaadin-elements';
import addWiredElementsPlugin from './wired-elements';

export default function addPlugins(dashboard: FrcDashboard): void {
  addDashboardComponentsPlugin(dashboard);
  addFrcPlugin(dashboard);
  addFrcSimPlugin(dashboard);
  addVaadinElementsPlugin(dashboard);
  addWiredElementsPlugin(dashboard);
}