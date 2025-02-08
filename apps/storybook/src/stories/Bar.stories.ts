import '@frc-web-components/fwc/components/bar';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  value: 0,
  min: -1,
  max: 1,
  center: 0,
  theme: 'light',
  'background-color': '#fff',
  '--frc-bar-background': '#ddd',
  '--frc-bar-foreground': 'lightblue',
  '--frc-bar-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/bar";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-bar min="-1" max="1"></frc-bar>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Bar } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Bar min={-1} max={1} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Bar',
  tags: ['autodocs'],
  component: 'frc-bar',
  args: defaultArgs,
  argTypes: {
    value: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    min: {
      table: {
        category: 'Properties',
        defaultValue: { summary: -1 },
      },
    },
    max: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 1 },
      },
    },
    center: {
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
          --frc-bar-background: ${args['--frc-bar-background']};
          --frc-bar-foreground: ${args['--frc-bar-foreground']};
          --frc-bar-color: ${args['--frc-bar-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-bar-color: white;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-bar-color: black;
      }
    </style>
  `;
}

function createBarStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-bar
        class=${args.theme}
        value=${args.value}
        min=${args.min}
        max=${args.max}
        center=${args.center}
      ></frc-bar>
    `,
  };
}

export const LightTheme = createBarStory({
  theme: 'light',
});

export const DarkTheme = createBarStory({
  theme: 'dark',
});
