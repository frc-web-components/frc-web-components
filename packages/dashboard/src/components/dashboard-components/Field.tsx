import { Field, FieldPath, FieldRobot } from '@frc-web-components/react';
import {
  booleanProp,
  colorProp,
  createComponent,
  numberArrayProp,
  numberProp,
  stringDropdownProp,
} from './fromProps';
import {
  baseUnit,
  fieldConfigs,
  toBaseUnitConversions,
} from '@frc-web-components/fwc';
import { useParentSourceTree } from '../context-providers/ComponentContext';
import { SourceTree } from '@store/selectors/sourceSelectors';
import getPoses from './get-poses';

export interface FieldObject {
  type: 'robot' | 'trajectory';
  poses: (Uint8Array | number[])[];
  sourceKey?: string;
  sourceProvider?: string;
}

const getChildren = (tree?: SourceTree): FieldObject[] => {
  if (!tree || tree.childrenSources['.type']?.value !== 'Field2d') {
    return [];
  }

  const children: FieldObject[] = [];
  Object.entries(tree.childrenSources).forEach(([property, childSource]) => {
    // Keys that start with '.' are metadata
    // TODO: Handle XModules property from YAGSL
    if (property.startsWith('.') || property === 'XModules') {
      return;
    }

    const source =
      childSource.children.length > 0
        ? childSource.childrenSources.pose
        : childSource;

    if (!source?.value || source.propertyType !== 'Number[]') {
      return;
    }
    const poses = getPoses(source.value as number[]);

    children.push({
      type: poses.length === 1 ? 'robot' : 'trajectory',
      poses,
      sourceKey: source.key,
      sourceProvider: source.provider,
    });
  });

  return children;
};

export const field = createComponent(
  {
    dashboard: {
      name: 'Field',
      description: '',
      defaultSize: { width: 300, height: 150 },
      minSize: { width: 60, height: 60 },
    },
    defaultSource: {
      key: '/SmartDashboard/Field',
      provider: 'NT',
    },
    children: [
      { type: 'fieldRobot', propertyTabName: 'Robot' },
      { type: 'fieldPath', propertyTabName: 'Path' },
    ],
    acceptedSourceTypes: ['Field2d'],
    properties: {
      game: stringDropdownProp({
        defaultValue: 'Reefscape',
        options: fieldConfigs.map((field) => field.game),
      }),
      rotationUnit: stringDropdownProp({
        defaultValue: 'deg',
        options: ['deg', 'rad'],
      }),
      unit: stringDropdownProp({
        defaultValue: baseUnit,
        options: Object.keys(toBaseUnitConversions),
      }),
      rotation: numberProp({ min: -360, max: 360 }),
      showGrid: booleanProp(),
      gridSize: numberProp({ min: 0, defaultValue: 1 }),
      origin: stringDropdownProp({
        defaultValue: 'blue',
        options: ['blue', 'red'],
      }),
      cropLeft: numberProp({ min: 0, max: 100 }),
      cropRight: numberProp({ defaultValue: 100, min: 0, max: 100 }),
      cropTop: numberProp({ min: 0, max: 100 }),
      cropBottom: numberProp({ defaultValue: 100, min: 0, max: 100 }),
    },
  },
  ({ children, cropLeft, cropRight, cropTop, cropBottom, ...props }) => {
    const tree = useParentSourceTree();
    const sourceChildren = getChildren(tree);
    return (
      <Field
        style={{}}
        cropLeft={cropLeft / 100}
        cropRight={cropRight / 100}
        cropTop={cropTop / 100}
        cropBottom={cropBottom / 100}
        {...(props as any)}
      >
        {sourceChildren.map((child) => {
          if (child.type === 'robot') {
            return (
              <FieldRobot
                key={child.sourceKey}
                pose={child.poses[0] as number[]}
              />
            );
          }
          return <FieldPath key={child.sourceKey} poses={child.poses} />;
        })}
        {children}
      </Field>
    );
  },
);

export const fieldRobot = createComponent(
  {
    dashboard: {
      name: 'Robot',
      description: '',
      defaultSize: { width: 0, height: 0 },
      minSize: { width: 0, height: 0 },
      topLevel: false,
    },
    properties: {
      pose: numberArrayProp({ defaultValue: [0, 0, 0] }),
      rotationUnit: stringDropdownProp({
        defaultValue: 'inherit',
        options: ['inherit', 'deg', 'rad'],
      }),
      unit: stringDropdownProp({
        defaultValue: 'inherit',
        options: ['inherit', ...Object.keys(toBaseUnitConversions)],
      }),
      color: colorProp({ defaultValue: '#0000ff' }),
      opacity: numberProp({ defaultValue: 1, min: 0, max: 1, step: 0.1 }),
      rotation: numberProp({ min: -360, max: 360 }),
      width: numberProp({ defaultValue: 0.6 }),
      length: numberProp({ defaultValue: 0.9 }),
    },
  },
  (props) => {
    return <FieldRobot {...props} />;
  },
);

export const fieldPath = createComponent(
  {
    dashboard: {
      name: 'Path',
      description: '',
      defaultSize: { width: 0, height: 0 },
      minSize: { width: 0, height: 0 },
      topLevel: false,
    },
    properties: {
      poses: numberArrayProp(),
      color: colorProp({ defaultValue: '#FFA500' }),
      unit: stringDropdownProp({
        defaultValue: 'inherit',
        options: ['inherit', ...Object.keys(toBaseUnitConversions)],
      }),
      lineWidth: numberProp({ defaultValue: 4, min: 0 }),
      opacity: numberProp({ defaultValue: 0.7, min: 0, max: 1, step: 0.1 }),
    },
  },
  (props) => {
    return <FieldPath {...props} />;
  },
);
