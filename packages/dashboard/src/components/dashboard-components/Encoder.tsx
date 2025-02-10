import { Encoder } from '@frc-web-components/react';
import { createComponent, numberProp } from './fromProps';

export const encoder = createComponent(
  {
    dashboard: {
      name: 'Encoder',
      description: '',
      defaultSize: { width: 150, height: 150 },
      minSize: { width: 50, height: 50 },
    },
    properties: {
      distance: numberProp(),
      speed: numberProp(),
    },
  },
  (props) => {
    return <Encoder {...props} />;
  },
);
