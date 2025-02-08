import React from 'react';
import { createComponent } from '@lit/react';
import NumberBarWc from '@frc-web-components/fwc/components/number-bar';

export const NumberBar = createComponent({
  tagName: 'frc-number-bar',
  elementClass: NumberBarWc,
  react: React,
});

export default NumberBar;
