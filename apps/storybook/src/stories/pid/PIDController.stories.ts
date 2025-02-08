import '@frc-web-components/fwc/components/pid';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  p: 0,
  i: 0,
  d: 0,
  setpoint: 0,
  theme: 'light',
  'background-color': '#fff',
  '--frc-pid-controller-text-color': 'black',
  '--frc-pid-controller-input-background-color': 'white',
  '--frc-pid-controller-input-border-color': '#e0e0e0',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/pid";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-pid-controller p="0" i="0" d="0" setpoint="0"></frc-pid-controller>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { PidController } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <PidController p={0} i={0} d={0} setpoint={0} />
 * ```
 */
const meta: Meta = {
  title: 'PID Controller/PID Controller',
  tags: ['autodocs'],
  component: 'frc-pid-controller',
  args: defaultArgs,
  argTypes: {
    p: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    i: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    d: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    setpoint: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
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
    '--frc-pid-controller-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-pid-controller-input-background-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: 'white' },
      },
    },
    '--frc-pid-controller-input-border-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: '#e0e0e0' },
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
          --frc-pid-controller-text-color: ${args[
            '--frc-pid-controller-text-color'
          ]};
          --frc-pid-controller-input-background-color: ${args[
            '--frc-pid-controller-input-background-color'
          ]};
          --frc-pid-controller-input-border-color: ${args[
            '--frc-pid-controller-input-border-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-pid-controller-text-color: white;
          --frc-pid-controller-input-background-color: rgba(255, 255, 255, 0.2);
          --frc-pid-controller-input-border-color: rgba(255, 255, 255, 0.5);
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-pid-controller-text-color: black;
        --frc-pid-controller-input-background-color: white;
        --frc-pid-controller-input-border-color: #e0e0e0;
      }
    </style>
  `;
}

function createPidControllerStory(
  optionalArgs: Record<string, any> = {},
): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-pid-controller
        class=${args.theme}
        p=${args.p}
        i=${args.i}
        d=${args.d}
        setpoint=${args.setpoint}
      ></frc-pid-controller>
    `,
  };
}

export const LightTheme = createPidControllerStory({
  theme: 'light',
});

export const DarkTheme = createPidControllerStory({
  theme: 'dark',
});
