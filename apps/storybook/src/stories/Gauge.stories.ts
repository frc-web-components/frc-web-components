import '@frc-web-components/fwc/components/gauge';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  value: 0,
  min: 0,
  max: 100,
  theme: 'light',
  'background-color': '#fff',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/gauge";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-gauge value="0" min="0" max="100"></frc-gauge>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Gauge } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Gauge value={0} min={0} max={100} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Gauge',
  tags: ['autodocs'],
  component: 'frc-gauge',
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
        defaultValue: { summary: 0 },
      },
    },
    max: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 100 },
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

function createGaugeStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      <frc-gauge
        class=${args.theme}
        value=${args.value}
        min=${args.min}
        max=${args.max}
      ></frc-gauge>
    `,
  };
}

export const Gauge = createGaugeStory();
