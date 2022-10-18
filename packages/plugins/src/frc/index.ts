import { FrcDashboard } from '@frc-web-components/dashboard';
import { SourceProvider } from '@webbitjs/store';
// import NetworkTablesProvider from './networktables-provider';
import Nt4Provider from './nt4/nt4-provider';
import frcElements from './elements';
import addTutorials from './tutorials';

export default function addPlugin(dashboard: FrcDashboard): void {
  // dashboard.addSourceProvider('NetworkTables', new NetworkTablesProvider());
  dashboard.addSourceProvider('NetworkTables', new Nt4Provider());
  dashboard.addSourceProvider('Demo', new SourceProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
  dashboard.addElements(frcElements as any, 'FRC');
  addTutorials(dashboard);
}
