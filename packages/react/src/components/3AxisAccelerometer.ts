import React from 'react';
import { createComponent } from '@lit/react';
import ThreeAxisAccelerometerWc from '@frc-web-components/fwc/components/3-axis-accelerometer';

export const ThreeAxisAccelerometer = createComponent({
  tagName: 'frc-3-axis-accelerometer',
  elementClass: ThreeAxisAccelerometerWc,
  react: React,
});

export default ThreeAxisAccelerometer;
