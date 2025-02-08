import React from 'react';
import { createComponent } from '@lit/react';
import NetworkAlertsWc from '@frc-web-components/fwc/components/network-alerts';

export const NetworkAlerts = createComponent({
  tagName: 'frc-network-alerts',
  elementClass: NetworkAlertsWc,
  react: React,
});

export default NetworkAlerts;
