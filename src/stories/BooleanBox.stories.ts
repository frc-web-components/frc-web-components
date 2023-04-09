import '../elements/base/boolean-box';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const defaultArgs: Record<string, any> = {
  value: false,
  falseColor: '#ff0000',
  trueColor: '#00ff00',
  label: '',
};

const meta: Meta = {
  title: 'FRC/Boolean Box',
  tags: ['autodocs'],
  component: 'frc-boolean-box',
  args: defaultArgs,
  argTypes: {
    falseColor: { control: 'color' },
    trueColor: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj;

function createBooleanBoxStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      <frc-boolean-box
        ?value=${args.value}
        false-color=${ifDefined(args.falseColor || undefined)}
        true-color=${ifDefined(args.trueColor || undefined)}
        label=${ifDefined(args.label || undefined)}
      ></frc-boolean-box>
    `,
  };
}

export const FalseValue = createBooleanBoxStory();
export const TrueValue = createBooleanBoxStory({ value: true });
export const CustomFalseColor = createBooleanBoxStory({
  falseColor: '#f67b12',
});
export const CustomTrueColor = createBooleanBoxStory({
  value: true,
  trueColor: '#21e4bb',
});
export const WithLabel = createBooleanBoxStory({ label: `I'm a box` });
