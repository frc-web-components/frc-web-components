import React from 'react';
import { createComponent } from '@lit/react';
import RelayWc from '@frc-web-components/fwc/components/relay';

export const Relay = createComponent({
  tagName: 'frc-relay',
  elementClass: RelayWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export default Relay;
