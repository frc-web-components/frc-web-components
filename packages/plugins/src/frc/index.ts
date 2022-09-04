import { FrcDashboard } from '@frc-web-components/dashboard';
import NetworkTablesProvider from './networktables-provider';
import frcElements from './elements';

export default function addPlugin(dashboard: FrcDashboard): void {
  dashboard.addSourceProvider('NetworkTables', new NetworkTablesProvider());
  dashboard.setDefaultSourceProvider('NetworkTables');
  dashboard.addElements(frcElements as any, 'FRC');
  dashboard.addTutorial({
    id: 'frc-boolean-box',
    name: 'Boolean Box Demo',
    element: 'frc-boolean-box',
    html: `
      <div>
        <p>Some box:</p>
        <frc-boolean-box></frc-boolean-box>
      </div>
    `,
  });
}