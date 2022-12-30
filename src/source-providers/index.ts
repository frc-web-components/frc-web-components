import { FrcDashboard } from '../dashboard';
import GamepadProvider from './gamepad-provider';
import Nt4Provider from './nt4/nt4-provider';

export default function addProviders(dashboard: FrcDashboard): void {
  dashboard.addSourceProvider('NetworkTables', new Nt4Provider());
  dashboard.addSourceProvider('Gamepad', new GamepadProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
}
