import { FrcDashboard } from '@frc-web-components/dashboard';
import addDashboardComponentsPlugin from './dashboard-components';
import addFrcPlugin from './frc';
import addFrcSimPlugin from './frc-sim';
import addFormElementsPlugin from './form-elements';
import addTutorialPlugin from './tutorial';
import addSourceElementsPlugin from './source-elements';

export default function addPlugins(dashboard: FrcDashboard): void {
  addDashboardComponentsPlugin(dashboard);
  addFrcPlugin(dashboard);
  addFrcSimPlugin(dashboard);
  addFormElementsPlugin(dashboard);
  addTutorialPlugin();
  addSourceElementsPlugin(dashboard);
}

export const addDashboardComponents = addDashboardComponentsPlugin;
export const addFrc = addFrcPlugin;
export const addFrcSim = addFrcSimPlugin;
export const addFormElements = addFormElementsPlugin;
export const addTutorial = addTutorialPlugin;
export const addSourceElements = addSourceElementsPlugin;
