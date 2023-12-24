import '../components/sendable-chooser';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const defaultArgs: Record<string, any> = {
  options: ['Option 1', 'Option 2'],
  selected: 'Option 1',
  default: '',
  active: '',
  label: 'Auto Choices',
};

const meta: Meta = {
  title: 'FRC/Sendable Chooser',
  tags: ['autodocs'],
  component: 'frc-sendable-chooser',
  args: defaultArgs,
  argTypes: {
    options: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: [] },
      },
    },
    selected: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    default: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    active: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
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

function createSendableChooserStory(
  optionalArgs: Record<string, any> = {}
): Story {
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
      <frc-sendable-chooser
        .options=${args.options}
        selected=${args.selected}
        default=${args.default}
        active=${args.active}
        label=${args.label}
      ></frc-sendable-chooser>
    `,
  };
}

export const SendableChooser = createSendableChooserStory();
