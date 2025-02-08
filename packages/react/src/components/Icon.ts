import React from 'react';
import { createComponent } from '@lit/react';
import IconWc from '@frc-web-components/fwc/components/icon';

export const Icon = createComponent({
  tagName: 'frc-icon',
  elementClass: IconWc,
  react: React,
});

export default Icon;
