import React from 'react';
import { createComponent } from '@lit/react';
import BarWc from '@frc-web-components/fwc/components/bar';

export const Bar = createComponent({
  tagName: 'frc-bar',
  elementClass: BarWc,
  react: React,
});

export default Bar;
