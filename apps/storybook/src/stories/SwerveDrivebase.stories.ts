import '@frc-web-components/fwc/components/drivebases';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  moduleCount: 4,
  wheelLocations: [2.5, 2, 2.5, -2, -2.5, 2, -2.5, -2],
  measuredStates: [0, 0, 0, 0, 0, 0, 0, 0],
  desiredStates: [0, 0, 0, 0, 0, 0, 0, 0],
  robotRotation: 0,
  maxSpeed: 1,
  rotationUnit: 'radians',
  sizeLeftRight: 4,
  sizeFrontBack: 5,
  theme: 'light',
  'background-color': '#fff',
  '--frc-swerve-drive-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/drivebases";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-swerve-drivebase measured-states="[0,0,0,0,0,0,0,0]" desired-states="[0,0,0,0,0,0,0,0]"></frc-swerve-drivebase>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Swerve } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Swerve measuredStates={[0,0,0,0,0,0,0,0]} desiredStates={[0,0,0,0,0,0,0,0]} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Swerve Drivebase',
  tags: ['autodocs'],
  component: 'frc-swerve-drivebase',
  args: defaultArgs,
  argTypes: {
    moduleCount: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 4 },
      },
      control: { type: 'number', min: 2, step: 1 },
    },
    wheelLocations: {
      table: {
        category: 'Properties',
        defaultValue: { summary: [2.5, 2, 2.5, -2, -2.5, 2, -2.5, -2] },
      },
    },
    desiredStates: {
      table: {
        category: 'Properties',
        defaultValue: { summary: [0, 0, 0, 0, 0, 0, 0, 0] },
      },
    },
    measuredStates: {
      table: {
        category: 'Properties',
        defaultValue: { summary: [0, 0, 0, 0, 0, 0, 0, 0] },
      },
    },
    robotRotation: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    maxSpeed: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 1 },
      },
    },
    rotationUnit: {
      control: 'radio',
      options: ['radians', 'degrees'],
      table: {
        category: 'Properties',
        defaultValue: { summary: 'radians' },
      },
    },
    sizeLeftRight: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 4 },
      },
    },
    sizeFrontBack: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 5 },
      },
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark', 'custom'],
      table: {
        category: 'Styles',
        defaultValue: 'light',
      },
    },
    'background-color': {
      table: {
        category: 'Styles',
        defaultValue: '#fff',
      },
    },
    '--frc-swerve-drive-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
  },
  decorators: [
    (story, props) => {
      const isDarkTheme = props.args.theme === 'dark';
      const themeColor = isDarkTheme ? 'hsl(214, 35%, 21%)' : '#fff';
      const customColor = props.args['background-color'];
      return html` <div
        style=${styleMap({
          padding: '80px 60px',
          marginBottom: '5px',
          background: props.args.theme === 'custom' ? customColor : themeColor,
          display: 'flex',
          justifyContent: 'center',
        })}
      >
        ${story()}
      </div>`;
    },
  ],
};
export default meta;

type Story = StoryObj;

function getStyles(args: Args) {
  if (args.theme === 'custom') {
    return html`
      <style>
        .custom {
          --frc-swerve-drive-color: ${args['--frc-swerve-drive-color']};
          width: 250px;
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-swerve-drive-color: white;
          width: 250px;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-swerve-drive-color: black;
        width: 250px;
      }
    </style>
  `;
}

function createDrivebaseStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-swerve-drivebase
        class=${args.theme}
        module-count=${args.moduleCount}
        wheel-locations=${JSON.stringify(args.wheelLocations)}
        measured-states=${JSON.stringify(args.measuredStates)}
        desired-states=${JSON.stringify(args.desiredStates)}
        robot-rotation=${args.robotRotation}
        max-speed=${args.maxSpeed}
        rotation-unit=${args.rotationUnit}
        size-left-right=${args.sizeLeftRight}
        size-front-back=${args.sizeFrontBack}
      ></frc-swerve-drivebase>
    `,
  };
}

export const LightTheme = createDrivebaseStory({
  theme: 'light',
});

export const DarkTheme = createDrivebaseStory({
  theme: 'dark',
});
