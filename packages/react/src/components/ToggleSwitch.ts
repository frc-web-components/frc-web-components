import React from 'react';
import { createComponent } from '@lit/react';
import ToggleSwitchWc from '@frc-web-components/fwc/components/toggle-switch';

export const ToggleSwitch = createComponent({
  tagName: 'frc-toggle-switch',
  elementClass: ToggleSwitchWc,
  react: React,
  events: {
    ontoggle: 'toggle',
  },
});

export default ToggleSwitch;
