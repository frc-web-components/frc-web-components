import FrcDashboard from '../frc-dashboard';
import { addAbsolutePositionLayout } from './layers/absolute-position-layout';
import { addDragAndDrop } from './layers/drag-and-drop';

export default function addDashboardComponents(dashboard: FrcDashboard): void {
  addAbsolutePositionLayout(dashboard);
  addDragAndDrop(dashboard);
}
