import React from 'react';
import { createComponent } from '@lit/react';
import GyroWc from '@frc-web-components/fwc/components/gyro';

export const Gyro = createComponent({
  tagName: 'frc-gyro',
  elementClass: GyroWc,
  react: React,
});

export default Gyro;
