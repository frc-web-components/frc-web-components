import React from 'react';
import { createComponent } from '@lit/react';
import LoggerWc from '@frc-web-components/fwc/components/logger';

export const Logger = createComponent({
  tagName: 'frc-logger',
  elementClass: LoggerWc,
  react: React,
});

export default Logger;
