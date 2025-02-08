import { ComponentConfig } from '@/dashboard';
import { BasicFmsInfo, Gyro } from '@frc-web-components/react';
import { camera } from './Camera';
import { markdownViewer } from './MarkdownViewer';
import { numberSlider } from './NumberSlider';
import { booleanBox } from './BooleanBox';
import { checkboxGroup } from './CheckboxGroup';
import { radioGroup } from './RadioGroup';
import { robotCommand, robotSubsystem } from './CommandBased';
import { booleanProp, numberProp } from './fromProps';
import { field, fieldPath, fieldRobot } from './Field';
import {
  lineChart,
  lineChartAxis,
  lineChartData,
  lineChartLegend,
} from './LineChart';
import {
  swerveDrivebase,
  differentialDrivebase,
  mecanumDrivebase,
} from './Drivebases';
import { gauge } from './Gauge';
import { icon } from './Icon';
import { encoder } from './Encoder';
import { label, numberLabel } from './Labels';
import { mechanism2d } from './Mechanism2d';
import { networkAlerts } from './NetworkAlerts';
import {
  numberBar,
  accelerometer,
  voltageView,
  threeAxisAccelerometer,
} from './NumberBar';
import { pidCommand, pidController, profiledPidController } from './Pid';
import { preferences } from './Preferences';
import { toggleButton, toggleGroup } from './ToggleButton';
import { sendableChooser } from './Dropdowns';
import { relay } from './Relay';
import { toggleSwitch } from './toggleSwitch';
import { textField } from './TextField';
import { numberField } from './number-field/numberField';
// import { simComponents } from './sim';

export const componentMap: Record<string, ComponentConfig> = {
  basicFmsInfo: {
    dashboard: {
      name: 'Basic FMS Info',
      description: '',
      defaultSize: { width: 380, height: 100 },
      minSize: { width: 150, height: 90 },
    },
    defaultSource: {
      key: '/FMSInfo',
      provider: 'NT',
    },
    acceptedSourceTypes: ['FMSInfo'],
    properties: {
      eventName: { type: 'String', defaultValue: '' },
      matchNumber: { type: 'Number', defaultValue: 0 },
      matchType: { type: 'Number', defaultValue: 0 },
      fmsControlData: { type: 'Number', defaultValue: 0 },
    },
    component: BasicFmsInfo,
  },
  booleanBox,
  camera,
  checkboxGroup,
  radioGroup,
  robotCommand,
  robotSubsystem,
  field,
  fieldPath,
  fieldRobot,
  numberSlider,
  gyro: {
    dashboard: {
      name: 'Gyro',
      description: '',
      defaultSize: { width: 200, height: 240 },
      minSize: { width: 120, height: 120 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number', 'Gyro'],
    properties: {
      value: numberProp(),
      hideLabel: booleanProp(),
      precision: numberProp({ defaultValue: 2, min: 0, precision: 0 }),
      counterClockwise: booleanProp(),
      fromRadians: booleanProp(),
    },
    component: Gyro,
  },
  swerveDrivebase,
  differentialDrivebase,
  mecanumDrivebase,
  markdownViewer,
  lineChart,
  lineChartData,
  lineChartAxis,
  lineChartLegend,
  gauge,
  icon,
  label,
  numberLabel,
  mechanism2d,
  networkAlerts,
  numberBar,
  pidCommand,
  pidController,
  profiledPidController,
  preferences,
  toggleButton,
  toggleGroup,
  sendableChooser,
  threeAxisAccelerometer,
  accelerometer,
  voltageView,
  encoder,
  relay,
  toggleSwitch,
  textField,
  numberField,
  // ...simComponents,
};

export const componentList: ComponentConfig[] = Object.values(componentMap);
