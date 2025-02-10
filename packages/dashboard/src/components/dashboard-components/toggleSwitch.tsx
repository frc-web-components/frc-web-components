import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {
  booleanProp,
  createComponent,
  stringDropdownProp,
  stringProp,
} from './fromProps';

export const toggleSwitch = createComponent(
  {
    dashboard: {
      name: 'Toggle Switch',
      description: '',
      defaultSize: { width: 30, height: 30 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['Boolean'],
    primaryProperty: 'toggled',
    properties: {
      toggled: booleanProp(),
      label: stringProp(),
      color: stringDropdownProp({
        defaultValue: 'primary',
        options: [
          'error',
          'info',
          'primary',
          'secondary',
          'standard',
          'success',
          'warning',
        ],
      }),
      size: stringDropdownProp({
        defaultValue: 'medium',
        options: ['small', 'medium'],
      }),
    },
  },
  ({ toggled, label, color, size, setProperty }) => {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={toggled}
            onChange={(ev) => {
              setProperty('toggled', ev.target.checked);
            }}
            color={color as any}
            size={size as any}
          />
        }
        label={label}
      />
    );
  },
);
