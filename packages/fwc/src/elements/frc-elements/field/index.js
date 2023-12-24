import * as fieldObject from './field-object';
import * as fieldCamera from './field-camera';
import * as fieldRobot from './field-robot';
import * as FieldTrajectory from './field-trajectory';
import * as field from './field';
import getPoses from './get-poses';
import { elementConfig } from './field-element-config';

export const fieldElements = [
  fieldObject,
  fieldCamera,
  fieldRobot,
  FieldTrajectory,
  { elementName: 'frc-field', elementConfig },
];

window.getPoses = getPoses;
