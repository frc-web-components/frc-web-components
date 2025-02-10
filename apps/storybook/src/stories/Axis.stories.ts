import '@frc-web-components/fwc/components/axis';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  vertical: false,
  ticks: 5,
  min: -1,
  max: 1,
  unit: '',
  theme: 'light',
  'background-color': '#fff',
  '--frc-axis-text-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/axis";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-axis ticks="5" min="-1" max="1"></frc-axis>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Axis } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Axis ticks={5} min={-1} max={1} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Axis',
  tags: ['autodocs'],
  component: 'frc-axis',
  args: defaultArgs,
  argTypes: {
    vertical: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    ticks: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 5 },
      },
      control: { type: 'number', min: 0 },
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
        defaultValue: '#fff',
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
      return html`
        <div
          style=${styleMap({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            background:
              props.args.theme === 'custom' ? customColor : themeColor,
          })}
        >
          <div
            style=${styleMap({
              [props.args.vertical ? 'height' : 'width']: '200px',
              padding: '20px 20px',
              marginBottom: '20px',
            })}
          >
            ${story()}
          </div>
        </div>
      `;
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
          --frc-axis-text-color: ${args['--frc-axis-text-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-axis-text-color: white;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-axis-text-color: black;
      }
    </style>
  `;
}

function createAxisStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-axis
        class=${args.theme}
        ?vertical=${args.vertical}
        ticks=${args.ticks}
        min=${args.min}
        max=${args.max}
        unit=${ifDefined(args.unit || undefined)}
      ></frc-axis>
    `,
  };
}

export const LightTheme = createAxisStory({
  theme: 'light',
});

export const DarkTheme = createAxisStory({
  theme: 'dark',
});
