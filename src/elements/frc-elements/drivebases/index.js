import * as differential from './differential';
import * as mecanum from './mecanum';
import swerveConfig from './swerve/config';
import './swerve/swerve';

export const drivebaseElements = [
  differential,
  mecanum,
  { elementName: 'frc-swerve-drivebase', elementConfig: swerveConfig },
];
