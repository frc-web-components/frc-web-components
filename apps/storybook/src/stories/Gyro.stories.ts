import '@frc-web-components/fwc/components/gyro';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  value: 0,
  hideLabel: false,
  precision: 2,
  counterClockwise: false,
  fromRadians: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-gyro-color': 'black',
  '--frc-gyro-dial-color': 'blue',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/gyro";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-gyro value="90"></frc-gyro>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Gyro } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Gyro value={90} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Gyro',
  tags: ['autodocs'],
  component: 'frc-gyro',
  args: defaultArgs,
  argTypes: {
    value: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    hideLabel: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    precision: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 2 },
      },
      control: { type: 'number', min: 0, step: 1 },
    },
    counterClockwise: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    fromRadians: {
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
    '--frc-gyro-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-gyro-dial-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'blue' },
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
          --frc-gyro-color: ${args['--frc-gyro-color']};
          --frc-gyro-dial-color: ${args['--frc-gyro-dial-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-gyro-color: white;
          --frc-gyro-dial-color: blue;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-gyro-color: black;
        --frc-gyro-dial-color: blue;
      }
    </style>
  `;
}

function createGyroStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-gyro
        class=${args.theme}
        value=${args.value}
        ?hide-label=${args.hideLabel}
        precision=${args.precision}
        ?counter-clockwise=${args.counterClockwise}
        ?from-radians=${args.fromRadians}
      ></frc-gyro>
    `,
  };
}

export const LightTheme = createGyroStory({
  theme: 'light',
});

export const DarkTheme = createGyroStory({
  theme: 'dark',
});
