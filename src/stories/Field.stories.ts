// import React from 'react';
import '../elements/base/field/field';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import fieldConfigs from '../elements/base/field/field-configs';
import { baseUnit, toBaseConversions } from '../elements/base/field/units';

const defaultArgs: Record<string, any> = {
  game: fieldConfigs[0].game,
  cropType: 'percent',
  unit: baseUnit,
  rotation: 0,
  showGrid: false,
  gridSize: 1,
  origin: 'blue',
  // robotImage: '',
  robotColor: 'blue',
  robotOpacity: 1,
  robotX: 0,
  robotY: 0,
  robotAngle: 0,
  robotWidth: 0.6,
  robotLength: 0.9,
};

const meta: Meta = {
  title: 'FRC/Field',
  tags: ['autodocs'],
  component: 'frc-field',
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
    cropType: {
      control: 'radio',
      options: ['percent', 'distance'],
      table: {
        category: 'Field',
        defaultValue: 'percent',
      },
    },
    cropTop: {
      control: 'number',
      table: {
        category: 'Field',
      },
    },
    cropBottom: {
      control: 'number',
      table: {
        category: 'Field',
      },
    },
    cropLeft: {
      control: 'number',
      table: {
        category: 'Field',
      },
    },
    cropRight: {
      control: 'number',
      table: {
        category: 'Field',
      },
    },
    unit: {
      table: {
        category: 'Field',
        defaultValue: baseUnit,
      },
      options: Object.keys(toBaseConversions),
      control: 'select',
    },
    rotation: {
      table: {
        category: 'Field',
        defaultValue: { summary: 0 },
      },
    },
    showGrid: {
      table: {
        category: 'Field',
        defaultValue: { summary: false },
      },
    },
    gridSize: {
      table: {
        category: 'Field',
        defaultValue: { summary: 1 },
      },
    },
    origin: {
      control: 'radio',
      options: ['blue', 'red'],
      table: {
        category: 'Field',
        defaultValue: 'blue',
      },
    },
    robotColor: {
      control: 'color',
      table: {
        category: 'Robot',
        defaultValue: { summary: 'blue' },
      },
    },
    robotOpacity: {
      table: {
        category: 'Robot',
        defaultValue: { summary: 1 },
      },
    },
    robotX: {
      table: {
        category: 'Robot',
        defaultValue: { summary: 0 },
      },
    },
    robotY: {
      table: {
        category: 'Robot',
        defaultValue: { summary: 0 },
      },
    },
    robotAngle: {
      table: {
        category: 'Robot',
        defaultValue: { summary: 0 },
      },
    },
    robotWidth: {
      table: {
        category: 'Robot',
        defaultValue: { summary: 0.6 },
      },
    },
    robotLength: {
      table: {
        category: 'Robot',
        defaultValue: { summary: 0.9 },
      },
    },
  },
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
      <frc-field
        game=${args.game}
        crop-type=${args.cropType}
        crop-top=${ifDefined(args.cropTop ?? undefined)}
        crop-bottom=${ifDefined(args.cropBottom ?? undefined)}
        crop-left=${ifDefined(args.cropLeft ?? undefined)}
        crop-right=${ifDefined(args.cropRight ?? undefined)}
        unit=${args.unit}
        rotation=${args.rotation}
        ?show-grid=${args.showGrid}
        grid-size=${args.gridSize}
        origin=${args.origin}
      >
        <frc-field-robot
          color=${args.robotColor}
          opacity=${args.robotOpacity}
          pose="[${[args.robotX, args.robotY, args.robotAngle]}]"
          width=${args.robotWidth}
          length=${args.robotLength}
        ></frc-field-robot>
      </frc-field>
    `,
  };
}

export const Field = createFieldStory();
