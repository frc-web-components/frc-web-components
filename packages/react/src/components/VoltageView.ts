import React from 'react';
import { createComponent } from '@lit/react';
import VoltageViewWc from '@frc-web-components/fwc/components/voltage-view';

export const VoltageView = createComponent({
  tagName: 'frc-voltage-view',
  elementClass: VoltageViewWc,
  react: React,
});

export default VoltageView;
