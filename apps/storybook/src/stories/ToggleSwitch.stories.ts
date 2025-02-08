import '@frc-web-components/fwc/components/toggle-switch';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  toggled: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-toggle-switch-color': '#ccc',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/toggle-switch";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-toggle-switch toggled></frc-toggle-switch>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { ToggleSwitch } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <ToggleSwitch toggled />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Toggle Switch',
  tags: ['autodocs'],
  component: 'frc-toggle-switch',
  args: defaultArgs,
  argTypes: {
    toggled: {
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
    '--frc-toggle-switch-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: '#ccc' },
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
          --frc-toggle-switch-color: ${args['--frc-toggle-switch-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-toggle-switch-color: #999;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-toggle-switch-color: #ccc;
      }
    </style>
  `;
}

function createToggleSwitchStory(
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
      <frc-toggle-switch
        class=${args.theme}
        ?toggled=${args.toggled}
      ></frc-toggle-switch>
    `,
  };
}

export const LightTheme = createToggleSwitchStory({
  theme: 'light',
});

export const DarkTheme = createToggleSwitchStory({
  theme: 'dark',
});
