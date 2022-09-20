import { FrcDashboard } from '@frc-web-components/dashboard';
import booleanBoxTutorial from './boolean-box';

export default function addTutorials(dashboard: FrcDashboard): void {
  dashboard.addTutorial({
    id: 'frc-boolean-box',
    name: 'Boolean Box Demo',
    element: 'frc-boolean-box',
    html: booleanBoxTutorial,
  });
}
