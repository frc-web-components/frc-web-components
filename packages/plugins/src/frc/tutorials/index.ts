import { FrcDashboard } from '@frc-web-components/dashboard';
import booleanBoxTutorial from './boolean-box';
import threeAxisAccelerometer from './3-axis-accelerometer';
import accelerometer from './accelerometer';
import basicFmsInfo from './basic-fms-info';
import lineChart from './line-chart';

export default function addTutorials(dashboard: FrcDashboard): void {
  dashboard.addTutorial({
    id: 'frc-boolean-box',
    name: 'Boolean Box Demo',
    element: 'frc-boolean-box',
    html: booleanBoxTutorial,
  });
  dashboard.addTutorial({
    id: 'frc-3-axis-accelerometer',
    name: '3-Axis Accelerometer Demo',
    element: 'frc-3-axis-accelerometer',
    html: threeAxisAccelerometer,
  });
  dashboard.addTutorial({
    id: 'frc-accelerometer',
    name: 'Accelerometer Demo',
    element: 'frc-accelerometer',
    html: accelerometer,
  });
  dashboard.addTutorial({
    id: 'frc-basic-fms-info',
    name: 'Basic FMS Info',
    element: 'frc-basic-fms-info',
    html: basicFmsInfo,
  });
  dashboard.addTutorial({
    id: 'frc-line-chart',
    name: 'Line Chart',
    element: 'frc-line-chart',
    html: lineChart,
  });
}
