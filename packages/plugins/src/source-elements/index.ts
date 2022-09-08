import { FrcDashboard } from '@frc-web-components/dashboard';
import { fwcBooleanConfig } from './fwc-boolean';
import { fwcNumberConfig } from './fwc-number';

export default function addSourceElements(dashboard: FrcDashboard): void {
  dashboard.addElements({
    'fwc-boolean': fwcBooleanConfig,
    'fwc-number': fwcNumberConfig,
  }, 'Sources');
}