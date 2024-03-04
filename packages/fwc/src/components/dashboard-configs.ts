import { WebbitConfig } from '@webbitjs/webbit';
import { axisDashboardConfig } from './axis';
import { barDashboardConfig } from './bar';
import {
  differentialDrivebaseDashboardConfig,
  mecanumDrivebaseDashboardConfig,
  swerveDrivebaseDashboardConfig,
} from './drivebases';
import { iconDashboardConfig } from './icon';
import { threeAxisAccelerometerDashboardConfig } from './3-axis-accelerometer';
import { accelerometerDashboardConfig } from './accelerometer';
import { basicFmsInfoDashboardConfig } from './basic-fms-info';
import { booleanBoxDashboardConfig } from './boolean-box';
import { gaugeDashboardConfig } from './gauge';
import { gyroDashboardConfig } from './gyro';
import { numberBarDashboardConfig } from './number-bar';
import {
  sendableChooserDashboardConfig,
  sendableChooserOldDashboardConfig,
} from './sendable-chooser';
import { voltageViewDashboardConfig } from './voltage-view';
import { numberSliderDashboardConfig } from './number-slider';
import { toggleSwitchDashboardConfig } from './toggle-switch';
import { toggleButtonDashboardConfig } from './toggle-button';
import { toggleGroupDashboardConfig } from './toggle-group';
import { relayDashboardConfig } from './relay';
import { encoderDashboardConfig } from './encoder';
import { networkAlertsDashboardConfig } from './network-alerts';
import {
  pidCommandDashboardConfig,
  pidControllerDashboardConfig,
  profiledPidControllerDashboardConfig,
} from './pid';
import { scoringGridDashboardConfig } from './scoring-grid';
import {
  robotCommandDashboardConfig,
  robotSubsystemDashboardConfig,
} from './command-based';
import { mechanism2dDashboardConfig } from './mechanism2d';
import { lineChartDashboardConfigs } from './line-chart';
import {
  fieldDashboardConfig,
  fieldRobotDashboardConfig,
  fieldPathDashboardConfig,
} from './field';
import { cameraDashboardConfig } from './canvas';
import { labelDashboardConfig, numberLabelDashboardConfig } from './label';
import { formElementDashboardConfigs } from './form-elements';
import { preferencesDashboardConfig } from './preferences';

export const dashboardElementConfigs = {
  'frc-axis': axisDashboardConfig,
  'frc-bar': barDashboardConfig,
  'frc-differential-drivebase': differentialDrivebaseDashboardConfig,
  'frc-mecanum-drivebase': mecanumDrivebaseDashboardConfig,
  'frc-swerve-drivebase': swerveDrivebaseDashboardConfig,
  'frc-icon': iconDashboardConfig,
  'frc-3-axis-accelerometer': threeAxisAccelerometerDashboardConfig,
  'frc-accelerometer': accelerometerDashboardConfig,
  'frc-basic-fms-info': basicFmsInfoDashboardConfig,
  'frc-boolean-box': booleanBoxDashboardConfig,
  'frc-gauge': gaugeDashboardConfig,
  'frc-gyro': gyroDashboardConfig,
  'frc-number-bar': numberBarDashboardConfig,
  'frc-sendable-chooser': sendableChooserOldDashboardConfig,
  'frc-sendable-chooser-wrapper': sendableChooserDashboardConfig,
  'frc-voltage-view': voltageViewDashboardConfig,
  'frc-number-slider': numberSliderDashboardConfig,
  'frc-toggle-switch': toggleSwitchDashboardConfig,
  'frc-toggle-button': toggleButtonDashboardConfig,
  'frc-toggle-group': toggleGroupDashboardConfig,
  'frc-relay': relayDashboardConfig,
  'frc-encoder': encoderDashboardConfig,
  'frc-network-alerts': networkAlertsDashboardConfig,
  'frc-pid-command': pidCommandDashboardConfig,
  'frc-pid-controller': pidControllerDashboardConfig,
  'frc-profiled-pid-controller': profiledPidControllerDashboardConfig,
  'frc-scoring-grid': scoringGridDashboardConfig,
  'frc-robot-command': robotCommandDashboardConfig,
  'frc-robot-subsystem': robotSubsystemDashboardConfig,
  'frc-mechanism2d-wrapper': mechanism2dDashboardConfig,
  'frc-field-wrapper': fieldDashboardConfig,
  'frc-field-robot': fieldRobotDashboardConfig,
  'frc-field-path': fieldPathDashboardConfig,
  'frc-camera-wrapper': cameraDashboardConfig,
  'frc-label': labelDashboardConfig,
  'frc-number-label': numberLabelDashboardConfig,
  'frc-preferences-wrapper': preferencesDashboardConfig,
  ...lineChartDashboardConfigs,
  ...formElementDashboardConfigs,
} as Record<string, WebbitConfig>;
