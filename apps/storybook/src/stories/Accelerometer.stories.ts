import '@frc-web-components/fwc/components/accelerometer';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  value: 0,
  min: -1,
  max: 1,
  center: 0,
  precision: 2,
  hideText: false,
  numTickMarks: 3,
  unit: 'g',
  theme: 'light',
  'background-color': '#fff',
  '--frc-bar-background': '#ddd',
  '--frc-bar-foreground': 'lightblue',
  '--frc-bar-color': 'black',
  '--frc-axis-text-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/accelerometer";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-accelerometer value=".5"></frc-accelerometer>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Accelerometer } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Accelerometer value={.5} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Accelerometer',
  tags: ['autodocs'],
  component: 'frc-accelerometer',
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
    precision: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 2 },
      },
    },
    hideText: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    numTickMarks: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 3 },
      },
    },
    unit: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 'g' },
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
    '--frc-axis-text-color': {
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
          minHeight: '50px',
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
          --frc-axis-text-color: ${args['--frc-axis-text-color']};
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
          --frc-axis-text-color: white;
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
        --frc-axis-text-color: black;
      }
    </style>
  `;
}

function createAccelerometerStory(
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
      <frc-accelerometer
        class=${args.theme}
        value=${args.value}
        min=${args.min}
        max=${args.max}
        center=${args.center}
        precision=${args.precision}
        ?hide-text=${args.hideText}
        num-tick-marks=${args.numTickMarks}
        unit=${ifDefined(args.unit || undefined)}
      ></frc-accelerometer>
    `,
  };
}

export const LightTheme = createAccelerometerStory({
  theme: 'light',
});

export const DarkTheme = createAccelerometerStory({
  theme: 'dark',
});
