import '@frc-web-components/fwc/components/sendable-chooser';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  options: ['Option 1', 'Option 2'],
  selected: 'Option 1',
  default: '',
  active: '',
  label: 'Auto Choices',
  theme: 'light',
  'background-color': '#fff',
  '--frc-sendable-chooser-label-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/sendable-chooser";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-sendable-chooser selected="Option 1" options='["Option 1", "Option 2"]'></frc-sendable-chooser>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { SendableChooser } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <SendableChooser selected="Option 1" options={["Option 1", "Option 2"]} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Sendable Chooser',
  tags: ['autodocs'],
  component: 'frc-sendable-chooser',
  args: defaultArgs,
  argTypes: {
    options: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    selected: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    default: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    active: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    label: {
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
    '--frc-sendable-chooser-label-color': {
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
          --frc-sendable-chooser-label-color: ${args[
            '--frc-sendable-chooser-label-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-sendable-chooser-label-color: white;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-sendable-chooser-label-color: black;
      }
    </style>
  `;
}

function createSendableChooserStory(
  optionalArgs: Record<string, any> = {},
): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    parameters: {
      canvas: { sourceState: 'shown' },
    },
    render: (args) => html`
      ${getStyles(args)}
      <frc-sendable-chooser
        class=${args.theme}
        options=${JSON.stringify(args.options)}
        selected=${args.selected}
        default=${args.default}
        active=${args.active}
        label=${args.label}
      ></frc-sendable-chooser>
    `,
  };
}

export const SendableChooser = createSendableChooserStory();
