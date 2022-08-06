import NetworkTablesProvider from "./networktables-provider";
import frcElements from './elements';

export default function (dashboard) {
  dashboard.addSourceProvider('NetworkTables', new NetworkTablesProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
  dashboard.addElements(frcElements);
}