import '@frc-web-components/fwc/components/preferences';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  sourceRoot: '',
  preferences: {},
  search: '',
  hideTitle: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-preferences-input-text-color': 'black',
  '--frc-preferences-input-background-color': 'rgba(0,0,0,.1)',
  '--frc-preferences-label-color': 'black',
  '--frc-preferences-input-button-text-color': '#444',
  '--frc-preferences-placeholder-text-color': '#888',
  '--frc-preferences-header-background-color': 'lightblue',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/preferences";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-preferences></frc-preferences>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Preferences } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Preferences />
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
      description: '',
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
      description: '',
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
    '--frc-preferences-placeholder-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: '#888' },
      },
    },
    '--frc-preferences-header-background-color': {
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
          --frc-preferences-input-text-color: ${args[
            '--frc-preferences-input-text-color'
          ]};
          --frc-preferences-input-background-color: ${args[
            '--frc-preferences-input-background-color'
          ]};
          --frc-preferences-label-color: ${args[
            '--frc-preferences-label-color'
          ]};
          --frc-preferences-input-button-text-color: ${args[
            '--frc-preferences-input-button-text-color'
          ]};
          --frc-preferences-placeholder-text-color: ${args[
            '--frc-preferences-placeholder-text-color'
          ]};
          --frc-preferences-header-background-color: ${args[
            '--frc-preferences-header-background-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-preferences-input-text-color: white;
          --frc-preferences-input-background-color: rgba(255, 255, 255, 0.3);
          --frc-preferences-label-color: white;
          --frc-preferences-input-button-text-color: #ccc;
          --frc-preferences-placeholder-text-color: #aaa;
          --frc-preferences-header-background-color: steelblue;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-preferences-input-text-color: black;
        --frc-preferences-input-background-color: rgba(0, 0, 0, 0.1);
        --frc-preferences-header-background-color: lightblue;
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
      return html`
        ${getStyles(args)}
        <frc-preferences
          class=${args.theme}
          source-root=${args.sourceRoot}
          .preferences=${args.preferences}
          search=${args.search}
          ?hide-title=${args.hideTitle}
        ></frc-preferences>
      `;
    },
  };
}

export const Preferences = createPreferencesStory({
  preferences: {
    someNumber: 1,
    someBool: false,
    someString: 'hello',
    foo: {
      bar: 'baz',
    },
  },
});
