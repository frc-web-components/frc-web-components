import * as fwcApp from '@frc-web-components/app';
import '@frc-web-components/app/dist/style.css';

fwcApp.setAssetBasePath('/assets');
fwcApp.mountDashboard(document.getElementById('root')!);
(window as any).fwcApp = fwcApp;
