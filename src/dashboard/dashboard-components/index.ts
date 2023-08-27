import FrcDashboard from '../frc-dashboard';
import { addElementPreview } from './layers/element-preview';
import { addAbsolutePositionLayout } from './layers/absolute-position-layout';
import { addDragAndDrop } from './layers/drag-and-drop';

export default function addDashboardComponents(dashboard: FrcDashboard): void {
  addElementPreview(dashboard);
  addAbsolutePositionLayout(dashboard);
  addDragAndDrop(dashboard);
}
