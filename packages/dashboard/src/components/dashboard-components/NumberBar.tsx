import {
  Accelerometer,
  NumberBar,
  ThreeAxisAccelerometer,
  VoltageView,
} from '@frc-web-components/react';
import {
  booleanProp,
  createComponent,
  numberProp,
  stringProp,
} from './fromProps';

export const numberBar = createComponent(
  {
    dashboard: {
      name: 'Number Bar',
      description: '',
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 60 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number'],
    properties: {
      value: numberProp(),
      max: numberProp({ defaultValue: 1 }),
      min: numberProp({ defaultValue: -1 }),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2, min: 0 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp(),
    },
  },
  (props) => {
    return <NumberBar {...props} />;
  },
);

export const accelerometer = createComponent(
  {
    dashboard: {
      name: 'Accelerometer',
      description: '',
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 60 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number'],
    properties: {
      value: numberProp(),
      max: numberProp({ defaultValue: 1 }),
      min: numberProp({ defaultValue: -1 }),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp({ defaultValue: 'g' }),
    },
  },
  (props) => {
    return <Accelerometer {...props} />;
  },
);

export const voltageView = createComponent(
  {
    dashboard: {
      name: 'Voltage View',
      description: '',
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 60 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number', 'Analog Input'],
    properties: {
      value: numberProp(),
      max: numberProp({ defaultValue: 5 }),
      min: numberProp(),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp({ defaultValue: 'V' }),
    },
  },
  (props) => {
    return <VoltageView {...props} />;
  },
);

export const threeAxisAccelerometer = createComponent(
  {
    dashboard: {
      name: '3-Axis Accelerometer',
      description: '',
      defaultSize: { width: 200, height: 130 },
      minSize: { width: 80, height: 130 },
    },
    properties: {
      x: numberProp(),
      y: numberProp(),
      z: numberProp(),
      max: numberProp({ defaultValue: 1 }),
      min: numberProp({ defaultValue: -1 }),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp({ defaultValue: 'g' }),
    },
  },
  (props) => {
    return <ThreeAxisAccelerometer {...props} />;
  },
);
