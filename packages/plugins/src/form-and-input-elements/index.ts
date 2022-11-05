import { FrcDashboard } from '@frc-web-components/dashboard';
import elements from './elements';

export default function addFormElements(dashboard: FrcDashboard): void {
  dashboard.addElements(elements as any, 'Forms and Inputs');
}
