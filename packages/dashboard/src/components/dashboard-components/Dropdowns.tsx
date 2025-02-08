import { Autocomplete, TextField } from '@mui/material';
import { createComponent, stringArrayProp, stringProp } from './fromProps';

export const sendableChooser = createComponent(
  {
    dashboard: {
      name: 'Sendable Chooser',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String Chooser'],
    primaryProperty: 'selected',
    properties: {
      options: stringArrayProp(),
      selected: stringProp(),
      default: stringProp(),
      active: stringProp(),
      label: stringProp({ defaultValue: 'Auto Choices' }),
    },
  },
  ({
    options,
    selected,
    default: defaultValue,
    active,
    label,
    setProperty,
  }) => {
    return (
      <Autocomplete
        style={{
          height: 'auto',
          flex: 1,
          alignItems: 'flex-end',
        }}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            setProperty('selected', newValue);
          }
        }}
        options={options ?? []}
        value={selected || active || ''}
        defaultValue={defaultValue ?? ''}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            error={selected !== active}
            label={label}
            variant="standard"
          />
        )}
      />
    );
  },
);
