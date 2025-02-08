import * as fwcDashboard from '@frc-web-components/app';
import '@frc-web-components/app/dist/style.css';

fwcDashboard.setAssetBasePath('/assets');
fwcDashboard.mountDashboard(document.getElementById('root')!);
(window as any).fwcDashboard = fwcDashboard;
