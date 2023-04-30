import '../elements/base/field3d/field3d';
import '../elements/base/field3d/field3d-object';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import fieldConfigs from '../elements/base/field3d/field-configs';
import objectConfigs from '../elements/base/field3d/object-configs';

const defaultArgs: Record<string, any> = {
  game: fieldConfigs[0].game,
  origin: 'red',
  backgroundColor: 'black',
  enableVR: false,
  objectName: objectConfigs[0].name,
  objectTranslation: [0, 0, 0],
  objectRotation: [0, 0, 0, 0],
};

const meta: Meta = {
  title: 'FRC/Field3d',
  tags: ['autodocs'],
  component: 'frc-field3d',
  args: defaultArgs,
  argTypes: {
    game: {
      table: {
        category: 'Field',
        defaultValue: { summary: fieldConfigs[0].game },
      },
      options: fieldConfigs.map(({ game }) => game),
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
    objectTranslation: {
      control: 'object',
      table: {
        category: 'Object',
        defaultValue: { summary: [0, 0, 0] },
      },
    },
    objectRotation: {
      control: 'object',
      table: {
        category: 'Object',
        defaultValue: { summary: [0, 0, 0, 0] },
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
          translation=${JSON.stringify(args.objectTranslation)}
          rotation=${JSON.stringify(args.objectRotation)}
        ></frc-field3d-object>
      </frc-field3d>
    `,
  };
}

export const Field = createFieldStory();
export const VRField = createFieldStory({
  game: 'Infinite Recharge',
  enableVR: true,
  objectTranslation: [4, 3, 0],
});
