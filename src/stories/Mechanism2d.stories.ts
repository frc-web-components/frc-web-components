import '../components/mechanism2d';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  backgroundColor: '#000020',
  dims: [3, 3],
  roots: [],
};

const meta: Meta = {
  title: 'FRC/Mechanism2d',
  tags: ['autodocs'],
  component: 'frc-mechanism2d',
  args: defaultArgs,
  argTypes: {
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Properties',
        defaultValue: { summary: '#000020' },
      },
    },
    dims: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [3, 3] },
      },
    },
    roots: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
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

function createMechanism2dStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      <frc-mechanism2d
        class=${args.theme}
        background-color=${args.backgroundColor}
        dims=${JSON.stringify(args.dims)}
        roots=${JSON.stringify(args.roots)}
      ></frc-mechanism2d>
    `,
  };
}

export const Mechanism2d = createMechanism2dStory({
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
