import { iconset } from '@frc-web-components/fwc/components/icon';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

const defaultArgs: Record<string, any> = {
  color: 'black',
  customIcon: false,
  icon: Object.keys(iconset)[0],
  svgPath: '',
  viewBox: '0 0 24 24',
  theme: 'light',
  'background-color': '#fff',
  width: 24,
  height: 24,
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/icon";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-icon color="green" icon="check"></frc-icon>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Icon } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Icon color="green" icon="check" />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Icon',
  tags: ['autodocs'],
  component: 'frc-icon',
  args: defaultArgs,
  argTypes: {
    color: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 'black' },
      },
    },
    customIcon: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    icon: {
      table: {
        category: 'Properties',
        defaultValue: { summary: Object.keys(iconset)[0] },
      },
      options: Object.keys(iconset),
      control: {
        type: 'select',
      },
    },
    svgPath: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
      description:
        'Custom svg path. SVGs icons can be downloaded from here: https://fonts.google.com/icons',
    },
    viewBox: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '0 0 24 24' },
      },
      description:
        'ViewBox for custom svg. SVG icons can be downloaded from here: https://fonts.google.com/icons',
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
    width: {
      table: {
        category: 'Styles',
        defaultValue: 24,
      },
      control: { type: 'number', min: 0 },
    },
    height: {
      table: {
        category: 'Styles',
        defaultValue: 24,
      },
      control: { type: 'number', min: 0 },
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
  return html`
    <style>
      frc-icon {
        width: ${args.width}px;
        height: ${args.height}px;
      }
    </style>
  `;
}

function createIconStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-icon
        class=${args.theme}
        color=${args.color}
        icon=${ifDefined(!args.customIcon ? args.icon : undefined)}
        svg-path=${ifDefined(args.customIcon ? args.svgPath : undefined)}
        view-box=${ifDefined(args.customIcon ? args.viewBox : undefined)}
      ></frc-icon>
    `,
  };
}

export const Icon = createIconStory();
export const CustomIcon = createIconStory({
  customIcon: true,
  svgPath:
    'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z',
  viewBox: '0 -960 960 960',
});
