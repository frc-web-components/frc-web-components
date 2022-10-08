import { FrcDashboard } from '@frc-web-components/dashboard';
import booleanBoxTutorial from './boolean-box';
import threeAxisAccelerometer from './3-axis-accelerometer';
import accelerometer from './accelerometer';
import basicFmsInfo from './basic-fms-info';
import lineChart from './line-chart';
import gauge from './gauge';
import differentialDrive from './differential-drive';
import mecanumDrive from './mecanum-drive';
import gyro from './gyro';
import encoder from './encoder';
import numberBar from './number-bar';
import numberSlider from './number-slider';
import pdp from './pdp';

export default function addTutorials(dashboard: FrcDashboard): void {
  dashboard.addTutorial({
    id: 'frc-boolean-box',
    name: 'Boolean Box',
    element: 'frc-boolean-box',
    html: booleanBoxTutorial,
  });
  dashboard.addTutorial({
    id: 'frc-3-axis-accelerometer',
    name: '3-Axis Accelerometer',
    element: 'frc-3-axis-accelerometer',
    html: threeAxisAccelerometer,
  });
  dashboard.addTutorial({
    id: 'frc-accelerometer',
    name: 'Accelerometer',
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
  dashboard.addTutorial({
    id: 'frc-gauge',
    name: 'Gauge',
    element: 'frc-gauge',
    html: gauge,
  });
  dashboard.addTutorial({
    id: 'frc-differential-drivebase',
    name: 'Differential Drivebasew',
    element: 'frc-differential-drivebase',
    html: differentialDrive,
  });
  dashboard.addTutorial({
    id: 'frc-mecanum-drivebase',
    name: 'Mecanum Drivebasew',
    element: 'frc-mecanum-drivebase',
    html: mecanumDrive,
  });
  dashboard.addTutorial({
    id: 'frc-gyro',
    name: 'Gyro',
    element: 'frc-gyro',
    html: gyro,
  });
  dashboard.addTutorial({
    id: 'frc-encoder',
    name: 'Encoder',
    element: 'frc-encoder',
    html: encoder,
  });
  dashboard.addTutorial({
    id: 'frc-number-bar',
    name: 'Number Bar',
    element: 'frc-number-bar',
    html: numberBar,
  });
  dashboard.addTutorial({
    id: 'frc-number-slider',
    name: 'Number Slider',
    element: 'frc-number-slider',
    html: numberSlider,
  });
  dashboard.addTutorial({
    id: 'frc-pdp',
    name: 'PDP',
    element: 'frc-pdp',
    html: pdp,
  });
}
