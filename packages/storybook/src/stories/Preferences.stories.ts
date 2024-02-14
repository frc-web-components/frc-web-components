import '@frc-web-components/fwc/components/preferences';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  sourceRoot: '',
  preferences: {},
  search: '',
  editable: false,
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
  },
  decorators: [
    (story) => html` <div
      style=${styleMap({
      padding: '20px 10px',
      marginBottom: '5px',
    })}
    >
      ${story()}
    </div>`,
  ],
  // https://storybook.js.org/blog/storybook-addons-for-css/
  // https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
  // https://storybook.js.org/docs/react/writing-docs/autodocs
};
export default meta;

type Story = StoryObj;

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
