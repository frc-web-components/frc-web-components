import React from 'react';
import { createComponent } from '@lit/react';
import AxisWc from '@frc-web-components/fwc/components/axis';

export const Axis = createComponent({
  tagName: 'frc-axis',
  elementClass: AxisWc,
  react: React,
});

export default Axis;
