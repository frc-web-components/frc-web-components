import ElementPreviewLayer from "./layers/ElementPreviewLayer";
import AbsolutePositioningLayout from "./layers/absolute-position-layout"; 
import properties from './properties';
import elementEditors from './element-editors';
import topDrawerTabs from './top-drawer-tabs';
import bottomDrawerTabs from './bottom-drawer-tabs';

export default function(dashboard) {
  dashboard.addLayer('elementPreviewLayer', new ElementPreviewLayer());
  dashboard.addLayer('absolutePositionLayout', new AbsolutePositioningLayout());
  Object.entries(properties).map(([type, elementName]) => {
    dashboard.addPropertyInput(type, elementName);
  });
  Object.entries(elementEditors).map(([name, elementName]) => {
    dashboard.addElementEditor(name, elementName);
  });
  Object.entries(topDrawerTabs).map(([name, elementName]) => {
    dashboard.addTopDrawerTab(name, elementName);
  });
  Object.entries(bottomDrawerTabs).map(([name, elementName]) => {
    dashboard.addBottomDrawerTab(name, elementName);
  });
}