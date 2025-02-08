// import React from 'react';
import '@frc-web-components/fwc/components/boolean-box';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const defaultArgs: Record<string, any> = {
  value: false,
  falseColor: '#ff0000',
  trueColor: '#00ff00',
  label: '',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/boolean-box";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-boolean-box false-color="#9dae5c" true-color="#00ff00"></frc-boolean-box>
 * ```
 * Or use the component in React:
 *
 * ```jsx
 * import { BooleanBox } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <BooleanBox falseColor="#9dae5c" trueColor="#00ff00" />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Boolean Box',
  tags: ['autodocs'],
  component: 'frc-boolean-box',
  args: defaultArgs,
  argTypes: {
    value: {
      table: {
        category: 'Properties',
        defaultValue: { summary: false },
      },
    },
    falseColor: {
      control: 'color',
      table: {
        category: 'Properties',
        defaultValue: { summary: '#ff0000' },
      },
    },
    trueColor: {
      control: 'color',
      table: {
        category: 'Properties',
        defaultValue: { summary: '#00ff00' },
      },
    },
    label: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
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
    parameters: {
      canvas: { sourceState: 'shown' },
    },
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
