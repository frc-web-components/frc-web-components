import {
  addElements,
  addSourceProvider,
  addThemeRules,
  mountDashboard,
  setDefaultSourceProvider,
} from "@frc-web-components/app";
import { Nt4Provider } from "@frc-web-components/fwc/source-providers";
import { darkTheme } from "@frc-web-components/fwc/themes";
import { dashboardElementConfigs } from "@frc-web-components/fwc";

addThemeRules("dark", darkTheme);
addSourceProvider("NetworkTables", new Nt4Provider());
setDefaultSourceProvider("NetworkTables");
addElements(dashboardElementConfigs);
mountDashboard(document.getElementById("app")!);