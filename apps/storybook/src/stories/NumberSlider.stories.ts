import '@frc-web-components/fwc/components/number-slider';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  value: 0,
  min: -1,
  max: 1,
  blockIncrement: 0.05,
  theme: 'light',
  'background-color': '#fff',
  '--frc-axis-text-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/number-slider";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-number-slider value="0" min="-1" max="1"></frc-number-slider>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { NumberSlider } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <NumberSlider value={0} min={-1} max={1} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Number Slider',
  tags: ['autodocs'],
  component: 'frc-number-slider',
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
    blockIncrement: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0.05 },
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

function createNumberSliderStory(
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
      <frc-number-slider
        class=${args.theme}
        value=${args.value}
        min=${args.min}
        max=${args.max}
        block-increment=${args.blockIncrement}
      ></frc-number-slider>
    `,
  };
}

export const LightTheme = createNumberSliderStory({
  theme: 'light',
});

export const DarkTheme = createNumberSliderStory({
  theme: 'dark',
});
