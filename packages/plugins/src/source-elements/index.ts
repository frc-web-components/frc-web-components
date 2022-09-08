import { FrcDashboard } from '@frc-web-components/dashboard';
import { fwcBooleanConfig } from './fwc-boolean';

export default function addSourceElements(dashboard: FrcDashboard): void {
  dashboard.addElements({
    'fwc-boolean': fwcBooleanConfig,
  }, 'Sources');
}