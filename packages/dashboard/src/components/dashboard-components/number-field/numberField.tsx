import NumberInput from '../../shared/number-input/NumberInput';
import {
  booleanProp,
  createComponent,
  numberProp,
  stringProp,
} from '../fromProps';

export const numberField = createComponent(
  {
    dashboard: {
      name: 'Number Field',
      description: '',
      defaultSize: { width: 150, height: 40 },
      minSize: { width: 150, height: 40 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['Number'],
    properties: {
      value: numberProp(),
      label: stringProp(),
      disabled: booleanProp(),
      min: numberProp({ defaultValue: -Infinity }),
      max: numberProp({ defaultValue: Infinity }),
      step: numberProp({ defaultValue: 1, min: 0 }),
    },
  },
  ({ value, label, disabled, min, max, step, setProperty }) => {
    return (
      <NumberInput
        label={label}
        fullWidth
        disabled={disabled}
        value={value}
        style={{
          width: '100%',
          position: 'relative',
          height: '100%',
          minWidth: '0px',
        }}
        onChange={(val) => {
          if (val !== value) {
            setProperty('value', val);
          }
        }}
        min={min}
        max={max}
        step={step}
        size="small"
      />
    );
  },
);
