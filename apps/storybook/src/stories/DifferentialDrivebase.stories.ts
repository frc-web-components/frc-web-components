import '@frc-web-components/fwc/components/drivebases';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  leftMotorSpeed: 0,
  rightMotorSpeed: 0,
  theme: 'light',
  'background-color': '#fff',
  '--frc-differential-drivebase-drivetrain-color': 'black',
  '--frc-bar-background': '#ddd',
  '--frc-bar-foreground': 'lightblue',
  '--frc-axis-text-color': 'black',
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
 * <frc-differential-drivebase left-motor-speed="0" right-motor-speed="0">></frc-differential-drivebase>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Differential } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Differential leftMotorSpeed={0} rightMotorSpeed={0} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Differential Drivebase',
  tags: ['autodocs'],
  component: 'frc-differential-drivebase',
  args: defaultArgs,
  argTypes: {
    leftMotorSpeed: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
      control: { type: 'number', min: -1, max: 1 },
    },
    rightMotorSpeed: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
      control: { type: 'number', min: -1, max: 1 },
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
    '--frc-differential-drivebase-drivetrain-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-bar-background': {
      table: {
        category: 'Styles',
        defaultValue: { summary: '#ddd' },
      },
    },
    '--frc-bar-foreground': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: 'lightblue' },
      },
    },
    '--frc-axis-text-color': {
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
          padding: '20px 10px',
          marginBottom: '5px',
          background: props.args.theme === 'custom' ? customColor : themeColor,
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
          --frc-differential-drivebase-drivetrain-color: ${args[
            '--frc-differential-drivebase-drivetrain-color'
          ]};
          --frc-bar-background: ${args['--frc-bar-background']};
          --frc-bar-foreground: ${args['--frc-bar-foreground']};
          --frc-axis-text-color: ${args['--frc-axis-text-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-differential-drivebase-drivetrain-color: #aaa;
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-axis-text-color: white;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-differential-drivebase-drivetrain-color: black;
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-axis-text-color: black;
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
      <frc-differential-drivebase
        class=${args.theme}
        left-motor-speed=${args.leftMotorSpeed}
        right-motor-speed=${args.rightMotorSpeed}
      ></frc-differential-drivebase>
    `,
  };
}

export const LightTheme = createDrivebaseStory({
  theme: 'light',
});

export const DarkTheme = createDrivebaseStory({
  theme: 'dark',
});
