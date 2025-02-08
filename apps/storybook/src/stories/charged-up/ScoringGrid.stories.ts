import '@frc-web-components/fwc/components/scoring-grid';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  selection: -1,
  cubesScored: [],
  conesScored: [],
  hideLinks: false,
  reverseRow: false,
  reverseCol: false,
  theme: 'light',
  'background-color': '#fff',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/scoring-grid";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-scoring-grid selection="5" cubes-scored="[1,1,2,3,5,13]" cones-scored="[11,14,14]"></frc-scoring-grid>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { ScoringGrid } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <ScoringGrid selection={5} cubesScored={[1,1,2,3,5,13]} conesScored={[11,14,14]} />
 * ```
 */
const meta: Meta = {
  title: 'Charged Up/Scoring Grid',
  tags: ['autodocs'],
  component: 'frc-scoring-grid',
  args: defaultArgs,
  argTypes: {
    selection: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
      control: { type: 'number', min: 0, step: 27 },
    },
    cubesScored: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    conesScored: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    hideLinks: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    reverseRow: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    reverseCol: {
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
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
      }
    </style>
  `;
}

function createScoringGridStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-scoring-grid
        class=${args.theme}
        selection=${args.selection}
        cubes-scored=${JSON.stringify(args.cubesScored)}
        cones-scored=${JSON.stringify(args.conesScored)}
        ?hide-links=${args.hideLinks}
        ?reverse-row=${args.reverseRow}
        ?reverse-column=${args.reverseColumn}
      ></frc-scoring-grid>
    `,
  };
}

export const LightTheme = createScoringGridStory({
  theme: 'light',
  cubesScored: [1, 1, 2, 3, 5, 13],
  conesScored: [11, 14, 14],
});

export const DarkTheme = createScoringGridStory({
  theme: 'dark',
  cubesScored: [1, 1, 2, 3, 5, 13],
  conesScored: [11, 14, 14],
});
