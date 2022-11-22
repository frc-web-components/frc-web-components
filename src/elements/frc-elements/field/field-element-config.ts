import fieldConfig from './field-config';
import { baseUnit, toBaseConversions } from './units';

export const elementConfig = {
  dashboard: {
    displayName: 'Field',
  },
  properties: {
    provider: { type: 'SourceProvider', property: 'provider' },
    store: { type: 'Store', property: 'store' },
    sourceProvider: {
      type: 'String',
      attribute: 'source-provider',
      input: { type: 'None' },
    },
    sourceKey: {
      type: 'String',
      attribute: 'source-key',
      input: { type: 'None' },
    },
    game: {
      type: String,
      defaultValue: 'Rapid React',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions(): string[] {
          return fieldConfig.map((field) => field.game).concat('Custom');
        },
      },
    },
    width: {
      type: Number,
      defaultValue: 54,
      input: {
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    height: {
      type: Number,
      defaultValue: 27,
      input: {
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    unit: {
      type: String,
      defaultValue: baseUnit,
      input: {
        type: 'StringDropdown',
        getOptions(): string[] {
          return Object.keys(toBaseConversions);
        },
        allowCustomValues: false,
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    image: {
      type: String,
      input: {
        type: 'StringDropdown',
        defaultValue: fieldConfig[0]['field-image'],
        enableUpload: true,
        getOptions(): string[] {
          return fieldConfig.map((field) => field['field-image']);
        },
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    topLeftFieldCornerX: {
      type: Number,
      attribute: 'top-left-field-corner-x',
      input: {
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    topLeftFieldCornerY: {
      type: Number,
      attribute: 'top-left-field-corner-y',
      input: {
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    bottomRightFieldCornerX: {
      type: Number,
      attribute: 'bottom-right-field-corner-x',
      input: {
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    bottomRightFieldCornerY: {
      type: Number,
      attribute: 'bottom-right-field-corner-y',
      input: {
        isDisabled({ game }: { game: string }): boolean {
          return game !== 'Custom';
        },
      },
    },
    gridSize: { type: Number, attribute: 'grid-size', defaultValue: 1 },
    showGrid: { type: Boolean, attribute: 'show-grid' },
    swapAxes: { type: Boolean, attribute: 'swap-axes' },
  },
  demos: [
    {
      html: `
      <frc-field source-key="/SmartDashboard/Field" source-provider="NetworkTables">
      </frc-field>
    `,
    },
  ],
};
