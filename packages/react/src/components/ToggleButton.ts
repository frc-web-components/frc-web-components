import React from 'react';
import { createComponent } from '@lit/react';
import ToggleButtonWc from '@frc-web-components/fwc/components/toggle-button';

export const ToggleButton = createComponent({
  tagName: 'frc-toggle-button',
  elementClass: ToggleButtonWc,
  react: React,
  events: {
    ontoggle: 'toggle',
  },
});

export default ToggleButton;
