import { NumberSlider } from '@frc-web-components/react';
import { createComponent, numberProp } from './fromProps';

export const numberSlider = createComponent(
  {
    dashboard: {
      name: 'Number Slider',
      description: '',
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 55 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number'],
    properties: {
      value: numberProp(),
      min: numberProp({ defaultValue: -1 }),
      max: numberProp({ defaultValue: 1 }),
      blockIncrement: numberProp({ defaultValue: 0.05 }),
    },
  },
  ({ setProperty, ...props }) => {
    return (
      <NumberSlider
        {...props}
        onchange={(ev: any) => {
          setProperty('value', ev.detail.value);
        }}
      />
    );
  },
);
