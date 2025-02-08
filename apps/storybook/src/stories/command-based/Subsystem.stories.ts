import '@frc-web-components/fwc/components/command-based';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  default: '',
  command: '',
  hasCommand: false,
  hasDefault: false,
  label: '',
  name: '',
  hideName: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-label-text-color': 'black',
  '--frc-robot-subsystem-header-color': 'purple',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/command-based";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-robot-subsystem></frc-robot-subsystem>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { RobotSubsystem } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <RobotSubsystem />
 * ```
 */
const meta: Meta = {
  title: 'Command Based/Robot Subsystem',
  tags: ['autodocs'],
  component: 'frc-robot-subsystem',
  args: defaultArgs,
  argTypes: {
    default: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    command: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    hasCommand: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    hasDefault: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    label: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    name: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    hideName: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
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
    '--frc-label-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-robot-subsystem-header-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'purple' },
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
          --frc-label-text-color: ${args['--frc-label-text-color']};
          --frc-robot-subsystem-header-color: ${args[
            '--frc-robot-subsystem-header-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-label-text-color: white;
          --frc-robot-subsystem-header-color: #a020f0;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-label-text-color: black;
        --frc-robot-subsystem-header-color: purple;
      }
    </style>
  `;
}

function createSubsystemStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-robot-subsystem
        class=${args.theme}
        default=${args.default}
        command=${args.command}
        ?has-command=${args.hasCommand}
        ?has-default=${args.hasDefault}
        label=${args.label}
        name=${args.name}
        ?hide-name=${args.hideName}
      ></frc-robot-subsystem>
    `,
  };
}

export const LightTheme = createSubsystemStory({
  theme: 'light',
});

export const DarkTheme = createSubsystemStory({
  theme: 'dark',
});
