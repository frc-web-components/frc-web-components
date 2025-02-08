import React from 'react';
import { createComponent } from '@lit/react';
import FieldWc, {
  FieldPath as FieldPathWc,
  FieldRobot as FieldRobotWc,
} from '@frc-web-components/fwc/components/field';

export const Field = createComponent({
  tagName: 'frc-field',
  elementClass: FieldWc,
  react: React,
});

export const FieldRobot = createComponent({
  tagName: 'frc-field-robot',
  elementClass: FieldRobotWc,
  react: React,
});

export const FieldPath = createComponent({
  tagName: 'frc-field-path',
  elementClass: FieldPathWc,
  react: React,
});

export default Field;
