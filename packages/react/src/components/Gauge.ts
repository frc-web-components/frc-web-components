import React from 'react';
import { createComponent } from '@lit/react';
import GaugeWc from '@frc-web-components/fwc/components/gauge';

export const Gauge = createComponent({
  tagName: 'frc-gauge',
  elementClass: GaugeWc,
  react: React,
});

export default Gauge;
