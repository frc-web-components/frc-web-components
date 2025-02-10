import {
  booleanProp,
  colorProp,
  createComponent,
  stringProp,
} from './fromProps';

export const booleanBox = createComponent(
  {
    dashboard: {
      name: 'Boolean Box',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['Boolean'],
    primaryProperty: 'value',
    properties: {
      value: booleanProp(),
      trueColor: colorProp({ defaultValue: 'green' }),
      falseColor: colorProp({ defaultValue: 'red' }),
      label: stringProp(),
    },
  },
  ({ falseColor, label, trueColor, value }) => {
    return (
      <div
        style={{
          background: value ? trueColor : falseColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {label}
      </div>
    );
  },
);
