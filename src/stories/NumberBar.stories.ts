import '../elements/base/number-bar';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { keyed } from 'lit/directives/keyed.js';

const defaultArgs: Record<string, any> = {
  value: 0,
  min: -1,
  max: 1,
  center: 0,
  precision: 2,
  hideText: false,
  numTickMarks: 3,
  unit: '',
};

const meta: Meta = {
  title: 'FRC/Number Bar',
  tags: ['autodocs'],
  component: 'frc-number-bar',
  // args: defaultArgs,
  argTypes: {
    value: {
      table: {
        defaultValue: { summary: 0 },
      },
    },
    min: {
      table: {
        defaultValue: { summary: -1 },
      },
    },
    max: {
      table: {
        defaultValue: { summary: 1 },
      },
    },
    center: {
      table: {
        defaultValue: { summary: 0 },
      },
    },
    precision: {
      table: {
        defaultValue: { summary: 2 },
      },
    },
    hideText: {
      table: {
        defaultValue: { summary: false },
      },
    },
    numTickMarks: {
      table: {
        defaultValue: { summary: 3 },
      },
    },
    unit: {
      table: {
        defaultValue: { summary: '' },
      },
    },
  },
};
export default meta;

type Story = StoryObj;

function createNumberBarStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) =>
      html`
        <frc-number-bar
          value=${args.value}
          min=${args.min}
          max=${args.max}
          center=${args.center}
          precision=${args.precision}
          ?hide-text=${args.hideText}
          num-tick-marks=${args.numTickMarks}
          unit=${ifDefined(args.unit || undefined)}
        ></frc-number-bar>
      `,
  };
}

export const FalseValue = createNumberBarStory();
