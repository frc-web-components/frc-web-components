import '@frc-web-components/fwc/components/preferences';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  sourceRoot: '',
  preferences: {},
  search: '',
  editable: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-preferences-input-text-color': 'black',
  '--frc-preferences-input-background-color': 'rgba(0,0,0,.1)',
  '--frc-preferences-label-color': 'black',
  '--frc-preferences-input-button-text-color': '#444',
};

/**
 * To use this component import the module:
 * 
 * ```javascript
 * import "@frc-web-components/fwc/components/mechanism2d";
 * 
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 * 
 * And then add the component to your html:
 * 
 * ```html
 * <frc-mechanism2d></frc-mechanism2d>
 * ```
 * 
 * Or use the component in React:
 * 
 * ```jsx
 * import { Mechanism2d } from "@frc-web-components/react";
 * ```
 * 
 * And then add the component in your jsx:
 * 
 * ```jsx
 * <Mechanism2d />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Preferences',
  tags: ['autodocs'],
  component: 'frc-preferences',
  args: defaultArgs,
  argTypes: {
    sourceRoot: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
      description:
        '',
    },
    preferences: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: {} },
      },
    },
    search: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
      description:
        '',
    },
    editable: {
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
    '--frc-preferences-input-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-preferences-input-background-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'rgba(0,0,0,.1)' },
      },
    },
    '--frc-preferences-label-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-preferences-input-button-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: '#444' },
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
          --frc-preferences-input-text-color: ${args['--frc-input-text-color']};
          --frc-preferences-input-background-color: ${args['--frc-input-background-color']};
          --frc-preferences-label-color: ${args['--frc-preferences-label-color']};
          --frc-preferences-input-button-text-color: ${args['--frc-preferences-input-button-text-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-preferences-input-text-color: white;
          --frc-preferences-input-background-color: rgba(255,255,255,.3);
          --frc-preferences-label-color: white;
          --frc-preferences-input-button-text-color: #ccc;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-preferences-input-text-color: black;
        --frc-preferences-input-background-color: rgba(0,0,0,.1);
        --frc-preferences-input-button-text-color: #444;
      }
    </style>
  `;
}

function createPreferencesStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => {
      const preferences = {
        'a': 1,
        'b': false,
        c: 'hello',
        ssddfdfs: {
          "fsdf sff": {
            a: 1,
            b: 5
          }
        }
      };
      return html`
      ${getStyles(args)}
      <frc-preferences
        class=${args.theme}
        source-root=${args.sourceRoot}
        .preferences=${preferences}
        search=${args.search}
        ?editable=${args.editable}
        ?flat=${args.flat}
      ></frc-preferences>
    `;
    }
  };
}

export const Mechanism2d = createPreferencesStory({
  roots: [
    {
      x: 1.5,
      y: 0.5,
      children: [
        {
          angle: 90,
          color: '#00FF00',
          length: 0.5334,
          weight: 10,
          children: [
            {
              angle: 0,
              color: '#008000',
              length: 0.5,
              weight: 6,
              children: [],
            },
          ],
        },
      ],
    },
  ],
});
