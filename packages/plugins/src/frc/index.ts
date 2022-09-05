import { FrcDashboard } from '@frc-web-components/dashboard';
import NetworkTablesProvider from './networktables-provider';
import frcElements from './elements';
import addTutorials from './tutorials';

export default function addPlugin(dashboard: FrcDashboard): void {
  dashboard.addSourceProvider('NetworkTables', new NetworkTablesProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
  dashboard.addElements(frcElements as any, 'FRC');
  addTutorials(dashboard);
}