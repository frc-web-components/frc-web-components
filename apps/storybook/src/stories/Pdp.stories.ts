import '@frc-web-components/fwc/components/pdp';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  voltage: 0,
  totalCurrent: 0,
  channels: Array(16).fill(0),
  theme: 'light',
  'background-color': '#fff',
  '--frc-label-text-color': 'black',
  '--frc-axis-text-color': 'black',
  '--frc-bar-background': '#ddd',
  '--frc-bar-foreground': 'lightblue',
  '--frc-bar-color': 'black',
  '--frc-voltage-view-foreground-color': '#ffbd2f',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/pdp";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-pdp voltage="0" total-current="0" channels="[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]"></frc-pdp>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Pdp } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Pdp voltage={0} totalCurrent={0} channels={[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/PDP',
  tags: ['autodocs'],
  component: 'frc-pdp',
  args: defaultArgs,
  argTypes: {
    voltage: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
      control: { type: 'number', min: 0, max: 15 },
    },
    totalCurrent: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
      control: { type: 'number', min: 0, max: 500 },
    },
    channels: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: Array(16).fill(0) },
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
    '--frc-bar-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-axis-text-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-voltage-view-foreground-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: '#ffbd2f' },
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
          --frc-label-text-color: ${args['--frc-label-text-color']};
          --frc-bar-background: ${args['--frc-bar-background']};
          --frc-bar-foreground: ${args['--frc-bar-foreground']};
          --frc-bar-color: ${args['--frc-bar-color']};
          --frc-axis-text-color: ${args['--frc-axis-text-color']};
          --frc-voltage-view-foreground-color: ${args[
            '--frc-voltage-view-foreground-color'
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
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-bar-color: white;
          --frc-axis-text-color: white;
          --frc-voltage-view-foreground-color: #ffbd2f;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-label-text-color: black;
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-bar-color: black;
        --frc-axis-text-color: black;
        --frc-voltage-view-foreground-color: #dd9b0d;
      }
    </style>
  `;
}

function createPdpStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-pdp
        class=${args.theme}
        voltage=${args.voltage}
        total-current=${args.totalCurrent}
        channels=${JSON.stringify(args.channels)}
      ></frc-pdp>
    `,
  };
}

export const LightTheme = createPdpStory({
  theme: 'light',
});

export const DarkTheme = createPdpStory({
  theme: 'dark',
});
