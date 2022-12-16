// import { SourceProvider } from '@webbitjs/store';
import { FrcDashboard } from '../dashboard';
import GamepadProvider from './gamepad-provider';
import { setNetworkTablesProvider } from './nt-provider';

export default function addProviders(dashboard: FrcDashboard): void {
  setNetworkTablesProvider(dashboard);
  // dashboard.addSourceProvider('Demo', new SourceProvider());
  dashboard.addSourceProvider('Gamepad', new GamepadProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
}
