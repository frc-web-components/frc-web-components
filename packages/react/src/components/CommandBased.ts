import React from 'react';
import { createComponent } from '@lit/react';
import {
  RobotCommand as RobotCommandWc,
  RobotSubsystem as RobotSubsystemWc,
} from '@frc-web-components/fwc/components/command-based';

export const RobotCommand = createComponent({
  tagName: 'frc-robot-command',
  elementClass: RobotCommandWc,
  react: React,
  events: {
    ontoggle: 'toggle',
  },
});

export const RobotSubsystem = createComponent({
  tagName: 'frc-robot-subsystem',
  elementClass: RobotSubsystemWc,
  react: React,
});
