import React from 'react';
import { createComponent } from '@lit/react';
import ToggleGroupWc from '@frc-web-components/fwc/components/toggle-group';

export const ToggleGroup = createComponent({
  tagName: 'frc-toggle-group',
  elementClass: ToggleGroupWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export default ToggleGroup;
