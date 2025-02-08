import '@frc-web-components/fwc/components/encoder';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  distance: 0,
  speed: 0,
  theme: 'light',
  'background-color': '#fff',
  '--frc-encoder-label-color': '#000',
  '--frc-encoder-value-color': '#666',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/encoder";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-encoder distance="0" speed="0"></frc-encoder>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Encoder } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Encoder distance={0} speed={0} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Encoder',
  tags: ['autodocs'],
  component: 'frc-encoder',
  args: defaultArgs,
  argTypes: {
    distance: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    speed: {
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
    '--frc-encoder-label-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-encoder-value-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: '#666' },
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
          --frc-encoder-label-color: ${args['--frc-encoder-label-color']};
          --frc-encoder-value-color: ${args['--frc-encoder-value-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-encoder-label-color: white;
          --frc-encoder-value-color: #aaa;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-encoder-label-color: black;
        --frc-encoder-value-color: #666;
      }
    </style>
  `;
}

function createEncoderStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-encoder
        class=${args.theme}
        distance=${args.distance}
        speed=${args.speed}
      ></frc-encoder>
    `,
  };
}

export const LightTheme = createEncoderStory({
  theme: 'light',
});

export const DarkTheme = createEncoderStory({
  theme: 'dark',
});
