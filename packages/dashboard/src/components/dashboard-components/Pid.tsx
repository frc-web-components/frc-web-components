import {
  PidCommand,
  PidController,
  ProfiledPidController,
} from '@frc-web-components/react';
import { booleanProp, createComponent, numberProp } from './fromProps';

export const pidCommand = createComponent(
  {
    dashboard: {
      name: 'PID Command',
      description: '',
      defaultSize: { width: 160, height: 250 },
      minSize: { width: 140, height: 200 },
    },
    acceptedSourceTypes: ['Command'],
    properties: {
      p: numberProp(),
      i: numberProp(),
      d: numberProp(),
      setpoint: numberProp(),
      running: booleanProp(),
    },
  },
  ({ setProperty, ...props }) => {
    return (
      <PidCommand
        {...props}
        onchange={(ev: any) => {
          setProperty('p', ev.detail.p);
          setProperty('i', ev.detail.i);
          setProperty('d', ev.detail.d);
          setProperty('setpoint', ev.detail.setpoint);
          setProperty('running', ev.detail.running);
        }}
      />
    );
  },
);

export const pidController = createComponent(
  {
    dashboard: {
      name: 'PID Controller',
      description: '',
      defaultSize: { width: 160, height: 170 },
      minSize: { width: 140, height: 170 },
    },
    acceptedSourceTypes: ['PIDController'],
    properties: {
      p: numberProp(),
      i: numberProp(),
      d: numberProp(),
      setpoint: numberProp(),
    },
  },
  ({ setProperty, ...props }) => {
    return (
      <PidController
        {...props}
        onchange={(ev: any) => {
          setProperty('p', ev.detail.p);
          setProperty('i', ev.detail.i);
          setProperty('d', ev.detail.d);
          setProperty('setpoint', ev.detail.setpoint);
        }}
      />
    );
  },
);

export const profiledPidController = createComponent(
  {
    dashboard: {
      name: 'Profiled PID Controller',
      description: '',
      defaultSize: { width: 160, height: 170 },
      minSize: { width: 140, height: 170 },
    },
    acceptedSourceTypes: ['ProfiledPIDController'],
    properties: {
      p: numberProp(),
      i: numberProp(),
      d: numberProp(),
      goal: numberProp(),
    },
  },
  ({ setProperty, ...props }) => {
    return (
      <ProfiledPidController
        {...props}
        onchange={(ev: any) => {
          setProperty('p', ev.detail.p);
          setProperty('i', ev.detail.i);
          setProperty('d', ev.detail.d);
          setProperty('goal', ev.detail.goal);
        }}
      />
    );
  },
);
