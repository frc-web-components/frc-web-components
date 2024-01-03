import { WebbitConfig } from '@webbitjs/webbit';
import fieldConfigs, { FieldConfig } from './field-configs';

export const field3dDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Field 3D',
  },
  properties: {
    game: {
      type: 'String',
      defaultValue: fieldConfigs[0].game,
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions(): string[] {
          return fieldConfigs.map((field) => field.game);
        },
      },
    },
    origin: {
      type: 'String',
      defaultValue: 'red',
      input: {
        type: 'StringDropdown',
        getOptions: () => ['red', 'blue'],
        allowCustomValues: false,
      },
    },
    backgroundColor: {
      type: 'String',
      attribute: 'background-color',
      defaultValue: 'black',
      input: {
        type: 'ColorPicker',
      },
    },
  },
};
