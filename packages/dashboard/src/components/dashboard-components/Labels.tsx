import { Label, NumberLabel } from '@frc-web-components/react';
import { createComponent, numberProp, stringProp } from './fromProps';

export const label = createComponent(
  {
    dashboard: {
      name: 'Label',
      description: '',
      defaultSize: { width: 80, height: 30 },
      minSize: { width: 20, height: 20 },
    },
    primaryProperty: 'text',
    acceptedSourceTypes: ['String'],
    properties: {
      text: stringProp({ defaultValue: 'label' }),
    },
  },
  (props) => {
    return <Label {...props} />;
  },
);

export const numberLabel = createComponent(
  {
    dashboard: {
      name: 'Number Label',
      description: '',
      defaultSize: { width: 80, height: 30 },
      minSize: { width: 20, height: 20 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number'],
    properties: {
      value: numberProp(),
      precision: numberProp({ defaultValue: 2, min: 0 }),
    },
  },
  (props) => {
    return <NumberLabel {...props} />;
  },
);
