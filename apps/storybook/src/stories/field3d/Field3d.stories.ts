import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import {
  field3dConfigs,
  objectConfigs,
} from '@frc-web-components/fwc/components/field3d';

const defaultArgs: Record<string, any> = {
  game: field3dConfigs[0].game,
  origin: 'red',
  backgroundColor: 'black',
  enableVR: false,
  objectName: objectConfigs[0].name,
  pose: [0, 0, 0],
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/field3d";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-field3d game="Charged Up">
 *   <frc-field3d-object name="KitBot" pose="[0,0,0]"></frc-field3d-object>
 * </frc-field3d>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Field3d, Field3dObject } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Field3d game="Charged Up">
 *  <Field3dObject name="KitBot" pose={[0,0,0]} />
 * </Field3d>
 * ```
 */
const meta: Meta = {
  title: 'Field 3D/Field3d',
  tags: ['autodocs'],
  component: 'frc-field3d',
  args: defaultArgs,
  argTypes: {
    game: {
      table: {
        category: 'Field',
        defaultValue: { summary: field3dConfigs[0].game },
      },
      options: field3dConfigs.map(({ game }) => game),
      control: 'select',
    },
    origin: {
      control: 'radio',
      options: ['red', 'blue'],
      table: {
        category: 'Field',
        defaultValue: 'red',
      },
    },
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Field',
        defaultValue: { summary: 'black' },
      },
    },
    enableVR: {
      description:
        'VR field can be viewed by visiting this page in the browser of a VR enabled device',
      table: {
        category: 'Field',
        defaultValue: { summary: false },
      },
    },
    objectName: {
      table: {
        category: 'Object',
        defaultValue: { summary: objectConfigs[0].name },
      },
      options: objectConfigs.map(({ name }) => name),
      control: 'select',
    },
    pose: {
      control: 'object',
      table: {
        category: 'Object',
        defaultValue: { summary: [0, 0, 0] },
      },
    },
  },
  decorators: [
    (story) =>
      html` <div
        style=${styleMap({
          padding: '20px 10px',
          marginBottom: '5px',
        })}
      >
        <style>
          frc-field3d {
            width: 100%;
            height: 500px;
          }
        </style>
        ${story()}
      </div>`,
  ],
};
export default meta;

type Story = StoryObj;

function createFieldStory(optionalArgs: Record<string, any> = {}): Story {
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
      <frc-field3d
        game=${args.game}
        origin=${args.origin}
        background-color=${args.backgroundColor}
        ?enable-vr=${args.enableVR}
      >
        <frc-field3d-object
          name=${args.objectName}
          pose=${JSON.stringify(args.pose)}
        ></frc-field3d-object>
        <frc-field3d-urdf
          name="R2D2"
          .angles=${{
            rArmShx: 0.5,
            lArmShx: 0.5,
          }}
        ></frc-field3d-urdf>
      </frc-field3d>
    `,
  };
}

export const Field = createFieldStory();
export const VRField = createFieldStory({
  game: 'Infinite Recharge',
  enableVR: true,
  pose: [4, 3, 0],
});
