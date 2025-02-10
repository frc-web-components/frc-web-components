import { booleanProp, createComponent, stringProp } from './fromProps';
import TextField from '@mui/material/TextField';

export const textField = createComponent(
  {
    dashboard: {
      name: 'Text Field',
      description: '',
      defaultSize: { width: 120, height: 40 },
      minSize: { width: 50, height: 40 },
    },
    primaryProperty: 'value',
    acceptedSourceTypes: ['String'],
    properties: {
      value: stringProp(),
      label: stringProp(),
      placeholder: stringProp(),
      disabled: booleanProp(),
    },
  },
  ({ value, label, placeholder, disabled, setProperty }) => {
    return (
      <TextField
        sx={{ width: '100%' }}
        placeholder={placeholder}
        disabled={disabled}
        label={label}
        variant="standard"
        value={value}
        onChange={(ev) => {
          setProperty('value', ev.target.value);
        }}
        focused
      />
    );
  },
);
