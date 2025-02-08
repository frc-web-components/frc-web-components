import React from 'react';
import { createComponent } from '@lit/react';
import AccelerometerWc from '@frc-web-components/fwc/components/accelerometer';

export const Accelerometer = createComponent({
  tagName: 'frc-accelerometer',
  elementClass: AccelerometerWc,
  react: React,
});

export default Accelerometer;
