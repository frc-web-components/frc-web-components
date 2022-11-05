import { FrcDashboard } from '@frc-web-components/dashboard';
import { SourceProvider } from '@webbitjs/store';
import NetworkTablesProvider from './networktables-provider';
import frcElements from './elements';
import addTutorials from './tutorials';
import addTheme from './theme';

export default function addPlugin(dashboard: FrcDashboard): void {
  dashboard.addSourceProvider('NetworkTables', new NetworkTablesProvider());
  dashboard.addSourceProvider('Demo', new SourceProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
  dashboard.addElements(frcElements as any, 'FRC');
  addTutorials(dashboard);
  addTheme(dashboard);
}
