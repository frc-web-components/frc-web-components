/* eslint-disable no-param-reassign */
import { WebbitConfig } from '@webbitjs/webbit';
import defaultFieldConfigs, { FieldConfig } from './field-configs';

export function getField3dDashboardConfig({
  fieldConfigs = defaultFieldConfigs,
  assetPathPrefix = '',
}: {
  fieldConfigs?: FieldConfig[];
  assetPathPrefix?: string;
} = {}): WebbitConfig {
  const config: Partial<WebbitConfig> = {
    dashboard: {
      displayName: 'Field 3D',
      onInit: (element: HTMLElement) => {
        (element as any).assetPathPrefix = assetPathPrefix;
        (element as any).fieldConfigs = fieldConfigs;
      },
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
  return config as WebbitConfig;
}
