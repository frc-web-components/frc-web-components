import '@frc-web-components/fwc/components/3-axis-accelerometer';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  x: 0,
  y: 0,
  z: 0,
  min: -1,
  max: 1,
  center: 0,
  precision: 2,
  hideText: false,
  numTickMarks: 3,
  unit: 'g',
  theme: 'light',
  'background-color': 'white',
  '--frc-bar-background': '#ddd',
  '--frc-bar-foreground': 'lightblue',
  '--frc-bar-color': 'black',
  '--frc-axis-text-color': 'black',
  '--frc-3-axis-accelerometer-label-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/3-axis-accelerometer";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-3-axis-accelerometer x="0" y=".5" z="-1"></frc-3-axis-accelerometer>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { ThreeAxisAccelerometer } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <ThreeAxisAccelerometer x={0} y={.5} z={-1} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/3-Axis Accelerometer',
  tags: ['autodocs'],
  component: 'frc-3-axis-accelerometer',
  args: defaultArgs,
  argTypes: {
    x: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    y: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    z: {
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
        defaultValue: 'white',
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
    '--frc-3-axis-accelerometer-label-color': {
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
          --frc-3-axis-accelerometer-label-color: ${args[
            '--frc-3-axis-accelerometer-label-color'
          ]};
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
          --frc-3-axis-accelerometer-label-color: white;
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
        --frc-3-axis-accelerometer-label-color: black;
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
      <frc-3-axis-accelerometer
        class=${args.theme}
        x=${args.x}
        y=${args.y}
        z=${args.z}
        min=${args.min}
        max=${args.max}
        center=${args.center}
        precision=${args.precision}
        ?hide-text=${args.hideText}
        num-tick-marks=${args.numTickMarks}
        unit=${args.unit}
      ></frc-3-axis-accelerometer>
    `,
  };
}

export const LightTheme = createAccelerometerStory({
  theme: 'light',
});

export const DarkTheme = createAccelerometerStory({
  theme: 'dark',
});
