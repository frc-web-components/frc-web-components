import { FrcDashboard } from '../dashboard';
import addFormElements from './form-and-input-elements';
import frcElements from './frc-elements';
import addSourceElements from './source-elements';
import './vaadin';

export default function addElements(dashboard: FrcDashboard): void {
  addFormElements(dashboard);
  dashboard.addElements(frcElements as any, 'FRC');
  addSourceElements(dashboard);
}
