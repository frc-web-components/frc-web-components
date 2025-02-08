import React from 'react';
import { createComponent } from '@lit/react';
import NumberSliderWc from '@frc-web-components/fwc/components/number-slider';

export const NumberSlider = createComponent({
  tagName: 'frc-number-slider',
  elementClass: NumberSliderWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export default NumberSlider;
