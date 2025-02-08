import '@frc-web-components/fwc/components/command-based';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  name: 'Command',
  running: false,
  controllable: false,
  label: '',
  theme: 'light',
  'background-color': '#fff',
  '--frc-button-background-color': 'rgb(230, 230, 230)',
  '--frc-button-text-color': 'black',
  '--frc-button-toggled-background-color': 'black',
  '--frc-button-toggled-text-color': 'white',
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
 * <frc-robot-command name="Command"></frc-robot-command>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { RobotCommand } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <RobotCommand name="Command" />
 * ```
 */
const meta: Meta = {
  title: 'Command Based/Robot Command',
  tags: ['autodocs'],
  component: 'frc-robot-command',
  args: defaultArgs,
  argTypes: {
    name: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 'Command' },
      },
    },
    running: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    controllable: {
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
    '--frc-button-background-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'rgb(230, 230, 230)' },
      },
    },
    '--frc-button-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-button-toggled-background-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-button-toggled-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'white' },
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
  // https://storybook.js.org/blog/storybook-addons-for-css/
  // https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
  // https://storybook.js.org/docs/react/writing-docs/autodocs
};
export default meta;

type Story = StoryObj;

function getStyles(args: Args) {
  if (args.theme === 'custom') {
    return html`
      <style>
        .custom {
          --frc-button-background-color: ${args[
            '--frc-button-background-color'
          ]};
          --frc-button-text-color: ${args['--frc-button-text-color']};
          --frc-button-toggled-background-color: ${args[
            '--frc-button-toggled-background-color'
          ]};
          --frc-button-toggled-text-color: ${args[
            '--frc-button-toggled-text-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-button-background-color: rgba(255, 255, 255, 0.1);
          --frc-button-text-color: white;
          --frc-button-toggled-background-color: rgba(240, 240, 240);
          --frc-button-toggled-text-color: black;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-button-background-color: rgb(230, 230, 230);
        --frc-button-text-color: black;
        --frc-button-toggled-background-color: black;
        --frc-button-toggled-text-color: white;
      }
    </style>
  `;
}

function createCommandStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-robot-command
        class=${args.theme}
        name=${args.name}
        ?running=${args.running}
        ?controllable=${args.controllable}
        label=${args.label}
      ></frc-robot-command>
    `,
  };
}

export const LightTheme = createCommandStory({
  theme: 'light',
});

export const DarkTheme = createCommandStory({
  theme: 'dark',
});
