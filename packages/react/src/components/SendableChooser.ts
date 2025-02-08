import React from 'react';
import { createComponent } from '@lit/react';
import { SendableChooser as SendableChooserWc } from '@frc-web-components/fwc/components/sendable-chooser';

export const SendableChooser = createComponent({
  tagName: 'frc-sendable-chooser',
  elementClass: SendableChooserWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export default SendableChooser;
