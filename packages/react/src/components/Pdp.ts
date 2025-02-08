import React from 'react';
import { createComponent } from '@lit/react';
import PdpWc from '@frc-web-components/fwc/components/pdp';

export const Pdp = createComponent({
  tagName: 'frc-pdp',
  elementClass: PdpWc,
  react: React,
});

export default Pdp;
