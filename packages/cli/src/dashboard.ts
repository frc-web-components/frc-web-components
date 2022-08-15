import createDashboard from '@frc-web-components/frc-web-components';

(window as any).dashboard = createDashboard(document.body);

console.log('plugin path:', process.env.PLUGIN_PATH);