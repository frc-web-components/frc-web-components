import '@frc-web-components/fwc/components/network-alerts';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  errors: [],
  warnings: [],
  infos: [],
  level: 'info',
  hideTitle: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-network-alerts-text-color': 'black',
  '--frc-network-alerts-header-color': 'lightblue',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/network-alerts";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-network-alerts errors='["some error"]'></frc-network-alerts>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { NetworkAlerts } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <NetworkAlerts errors={["some error"]} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Network Alerts',
  tags: ['autodocs'],
  component: 'frc-network-alerts',
  args: defaultArgs,
  argTypes: {
    errors: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    warnings: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    infos: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    level: {
      control: 'radio',
      options: ['info', 'warning', 'error'],
      table: {
        category: 'Properties',
        defaultValue: 'info',
      },
    },
    hideTitle: {
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
    '--frc-network-alerts-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-network-alerts-header-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'lightblue' },
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
          --frc-network-alerts-text-color: ${args[
            '--frc-network-alerts-text-color'
          ]};
          --frc-network-alerts-header-color: ${args[
            '--frc-network-alerts-header-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-network-alerts-text-color: white;
          --frc-network-alerts-header-color: steelblue;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-network-alerts-text-color: black;
        --frc-network-alerts-header-color: lightblue;
      }
    </style>
  `;
}

function createNetworkAlertsStory(
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
      <frc-network-alerts
        class=${args.theme}
        errors=${JSON.stringify(args.errors)}
        warnings=${JSON.stringify(args.warnings)}
        infos=${JSON.stringify(args.infos)}
        level=${args.level}
        ?hide-title=${args.hideTitle}
      ></frc-network-alerts>
    `,
  };
}

export const LightTheme = createNetworkAlertsStory({
  theme: 'light',
  errors: [
    'Failed to initialize navX, odometry will likely be nonfunctional.',
    'Pressure sensor not connected, unable to move hood.',
  ],
  warnings: [
    'No override controller.',
    'Failed to read MAC, using default robot instead.',
  ],
  infos: ['Tuning mode active, expect decreased network performance.'],
});

export const DarkTheme = createNetworkAlertsStory({
  theme: 'dark',
  errors: [
    'Failed to initialize navX, odometry will likely be nonfunctional.',
    'Pressure sensor not connected, unable to move hood.',
  ],
  warnings: [
    'No override controller.',
    'Failed to read MAC, using default robot instead.',
  ],
  infos: ['Tuning mode active, expect decreased network performance.'],
});
