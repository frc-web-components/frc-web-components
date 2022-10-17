import { FrcDashboard } from '@frc-web-components/dashboard';
import { addElementPreview } from './layers/element-preview';
import { addAbsolutePositionLayout } from './layers/absolute-position-layout';
import properties from './properties';
import elementEditors from './element-editors';
import './element-tree';
import { addDragAndDrop } from './layers/drag-and-drop';

export default function addPlugin(dashboard: FrcDashboard): void {
  addElementPreview(dashboard);
  addAbsolutePositionLayout(dashboard);
  addDragAndDrop(dashboard);

  Object.entries(properties).forEach(([type, elementName]) => {
    dashboard.addPropertyInput(type, elementName);
  });
  Object.entries(elementEditors).forEach(([name, elementName]) => {
    dashboard.addElementEditor(name, elementName);
  });
}
