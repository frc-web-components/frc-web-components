import { WebbitConfig } from '@webbitjs/webbit';
import defaultFieldConfigs, { FieldConfig } from './field-configs';
import defaultObjectConfigs from './object-configs';
import { ObjectConfig, UrdfConfig } from './field-interfaces';
import defaultUrdfConfigs from './urdf-configs';
import { getField3dUrdfDashboardConfig } from './field3d-urdf-wrapper';
import { field3dPoseVisualizerConfig } from './field3d-pose-visualizer';

export function getField3dDashboardConfigs({
  fieldConfigs = defaultFieldConfigs,
  objectConfigs = defaultObjectConfigs,
  urdfConfigs = defaultUrdfConfigs,
  assetPathPrefix = '',
}: {
  fieldConfigs?: FieldConfig[];
  objectConfigs?: ObjectConfig[];
  urdfConfigs?: UrdfConfig[];
  assetPathPrefix?: string;
} = {}): Record<string, WebbitConfig> {
  const config: Partial<WebbitConfig> = {
    dashboard: {
      displayName: 'Field 3D',
      onInit: (element: HTMLElement) => {
        (element as any).assetPathPrefix = assetPathPrefix;
        (element as any).fieldConfigs = fieldConfigs;
        (element as any).objectConfigs = objectConfigs;
        (element as any).urdfConfigs = urdfConfigs;
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
      enableVR: {
        type: 'Boolean',
        attribute: 'enable-vr',
      },
      cameraPose: {
        type: 'Array',
        attribute: 'camera-pose',
        input: { type: 'NumberArray' },
      },
      fixedCamera: {
        type: 'Boolean',
        attribute: 'fixed-camera',
      },
    },
    slots: [
      {
        name: '',
        allowedChildren: [
          'frc-field3d-urdf-wrapper',
          'frc-field3d-pose-visualizer',
        ],
      },
    ],
  };

  return {
    'frc-field3d': config,
    'frc-field3d-urdf-wrapper': getField3dUrdfDashboardConfig(
      urdfConfigs.map(({ name }) => name),
    ),
    'frc-field3d-pose-visualizer': field3dPoseVisualizerConfig,
  } as Record<string, WebbitConfig>;
}
