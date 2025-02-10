import { RobotCommand, RobotSubsystem } from '@frc-web-components/react';
import { booleanProp, createComponent, stringProp } from './fromProps';

export const robotCommand = createComponent(
  {
    dashboard: {
      name: 'Command',
      description: '',
      defaultSize: { width: 100, height: 50 },
      minSize: { width: 40, height: 40 },
    },
    acceptedSourceTypes: ['Command'],
    properties: {
      name: stringProp({ defaultValue: 'Command' }),
      running: booleanProp(),
      controllable: booleanProp(),
      label: stringProp(),
    },
  },
  ({ setProperty, ...props }) => {
    return (
      <RobotCommand
        {...props}
        ontoggle={(ev: any) => {
          setProperty('running', ev.detail.running);
        }}
      />
    );
  },
);

export const robotSubsystem = createComponent(
  {
    dashboard: {
      name: 'Subsystem',
      description: '',
      defaultSize: { width: 200, height: 100 },
      minSize: { width: 50, height: 50 },
    },
    acceptedSourceTypes: ['Subsystem'],
    properties: {
      default: stringProp(),
      command: stringProp(),
      hasCommand: booleanProp(),
      hasDefault: booleanProp(),
      label: stringProp(),
      name: stringProp(),
      hideName: booleanProp(),
    },
  },
  ({ ...props }) => {
    return <RobotSubsystem {...props} />;
  },
);
