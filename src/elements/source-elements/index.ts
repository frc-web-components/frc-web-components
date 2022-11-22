import { FrcDashboard } from '../../dashboard';
import { fwcBooleanConfig } from './fwc-boolean';
import { fwcNumberConfig } from './fwc-number';
import { fwcStringConfig } from './fwc-string';

export default function addSourceElements(dashboard: FrcDashboard): void {
  dashboard.addElements(
    {
      'fwc-boolean': fwcBooleanConfig,
      'fwc-number': fwcNumberConfig,
      'fwc-string': fwcStringConfig,
    },
    'Sources'
  );
}
