// import React from 'react';
import {
  fieldConfigs,
  baseUnit,
  toBaseUnitConversions,
} from '@frc-web-components/fwc/components/field';
import '@frc-web-components/fwc/components/field';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

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

const fieldArgTypes: Record<string, any> = {
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
    options: Object.keys(toBaseUnitConversions),
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
};

const robotArgTypes: Record<string, any> = {
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
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/field";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-field game="Charged Up">
 *   <frc-field-robot pose="[0,0,0]"></frc-field-robot>
 *   <frc-field-path line-width="10" translations="[7,5,9,5,9,3,7,3,7,5,8,7,9,5]"></<frc-field-path>
 * </frc-field>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { Field, FieldPath, FieldRobot } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Field game="Charged Up">
 *   <FieldRobot pose={[0,0,0]} />
 *   <FieldPath lineWidth={10} translations={[7,5,9,5,9,3,7,3,7,5,8,7,9,5]} />
 * </Field>
 * ```
 */
const meta: Meta = {
  title: 'FRC/Field',
  tags: ['autodocs'],
  component: 'frc-field',
};
export default meta;

type Story = StoryObj;

function createFieldStory(): Story {
  return {
    args: defaultArgs,
    argTypes: {
      ...fieldArgTypes,
      ...robotArgTypes,
    },
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

export const FieldPath: Story = {
  args: {
    pathColor: 'green',
    pathOpacity: 0.7,
    lineWidth: 10,
    translations: [7, 5, 9, 5, 9, 3, 7, 3, 7, 5, 8, 7, 9, 5],
  },
  argTypes: {
    pathColor: {
      control: 'color',
      table: {
        category: 'Path',
        defaultValue: { summary: 'green' },
      },
    },
    pathOpacity: {
      table: {
        category: 'Path',
        defaultValue: { summary: 1 },
      },
    },
    lineWidth: {
      table: {
        category: 'Path',
        defaultValue: { summary: 4 },
      },
    },
    translations: {
      table: {
        category: 'Path',
        defaultValue: { summary: [] },
      },
    },
  },
  render: (args) => html`
    <frc-field>
      <frc-field-path
        color="red"
        opacity="1"
        poses="[1,3,0.22887754381363834,1.2990000000000002,3.0290000000000004,10.658528835460004,1.5920000000000005,3.112,20.372666018396302,1.8730000000000007,3.2430000000000003,29.101450825807632,2.136000000000001,3.4160000000000004,37.14767936631827,2.375000000000001,3.625000000000001,44.84721053029682,2.584000000000001,3.864000000000001,52.539946195371016,2.7570000000000006,4.127000000000001,60.565787789521615,2.888000000000001,4.408000000000002,69.26105821010881,2.9710000000000005,4.701000000000001,78.93100644680327,3,5,90.22887754381367,3.0290000000000004,4.701,100.65852883546,3.112,4.4079999999999995,110.372666018396,3.2430000000000003,4.127,119.10145082580961,3.4160000000000004,3.863999999999999,127.14767936631823,3.625000000000001,3.624999999999999,134.84721053029682,3.864000000000001,3.415999999999999,142.53994619537104,4.127000000000001,3.2429999999999994,150.5657877895216,4.408000000000002,3.111999999999999,159.26105821010884,4.701000000000001,3.0289999999999995,168.93100644680328]"
      ></frc-field-path>
      <frc-field-path
        color=${args.pathColor}
        opacity=${args.pathOpacity}
        line-width=${args.lineWidth}
        translations=${JSON.stringify(args.translations)}
      ></frc-field-path>
    </frc-field>
  `,
};
