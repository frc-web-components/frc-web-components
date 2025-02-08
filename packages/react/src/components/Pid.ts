import React from 'react';
import { createComponent } from '@lit/react';
import {
  PidCommand as PidCommandWc,
  PidController as PidControllerWc,
  ProfiledPidController as ProfiledPidControllerWc,
} from '@frc-web-components/fwc/components/pid';

export const PidCommand = createComponent({
  tagName: 'frc-pid-command',
  elementClass: PidCommandWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export const PidController = createComponent({
  tagName: 'frc-pid-controller',
  elementClass: PidControllerWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export const ProfiledPidController = createComponent({
  tagName: 'frc-profiled-pid-controller',
  elementClass: ProfiledPidControllerWc,
  react: React,
  events: {
    onchange: 'change',
  },
});
