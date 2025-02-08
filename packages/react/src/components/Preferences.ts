import React from 'react';
import { createComponent } from '@lit/react';
import { Preferences as PreferencesWc } from '@frc-web-components/fwc/components/preferences';

export const Preferences = createComponent({
  tagName: 'frc-preferences',
  elementClass: PreferencesWc,
  react: React,
  events: {
    onchange: 'change',
    onsearch: 'search',
  },
});

export default Preferences;
