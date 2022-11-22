// import { SourceProvider } from '@webbitjs/store';
import { FrcDashboard } from '../dashboard';
import Nt4Provider from './nt4/nt4-provider';
import GamepadProvider from './gamepad-provider';

export default function addProviders(dashboard: FrcDashboard): void {
  dashboard.addSourceProvider('NetworkTables', new Nt4Provider());
  // dashboard.addSourceProvider('Demo', new SourceProvider());
  dashboard.addSourceProvider('Gamepad', new GamepadProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
}
