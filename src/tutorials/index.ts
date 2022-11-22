import { FrcDashboard } from '../dashboard';
import './elements';
import addFrcTutorials from './frc';

export default function addTutorials(dashboard: FrcDashboard): void {
  // dashboard.addElements(elements, 'Tutorials');
  addFrcTutorials(dashboard);
}
