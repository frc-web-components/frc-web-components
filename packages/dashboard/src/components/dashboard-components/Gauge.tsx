import { Gauge } from '@frc-web-components/react';
import { createComponent, numberProp } from './fromProps';

export const gauge = createComponent(
  {
    dashboard: {
      name: 'Gauge',
      description: '',
      defaultSize: { width: 150, height: 150 },
      minSize: { width: 50, height: 50 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number'],
    properties: {
      min: numberProp(),
      max: numberProp({ defaultValue: 100 }),
      value: numberProp(),
    },
  },
  (props) => {
    return <Gauge {...props} />;
  },
);
