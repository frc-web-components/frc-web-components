import createDashboard from '@frc-web-components/frc-web-components';
import addPlugins from '@frc-web-components/plugins';

const dashboard = createDashboard(document.body);
addPlugins(dashboard);
(window as any).dashboard = dashboard;