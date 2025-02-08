import {
  booleanProp,
  createComponent,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from './fromProps';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';

export const radioGroup = createComponent(
  {
    dashboard: {
      name: 'Radio Group',
      description: '',
      defaultSize: { width: 60, height: 130 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String'],
    primaryProperty: 'selected',
    properties: {
      disabled: booleanProp(),
      label: stringProp(),
      options: stringArrayProp({ defaultValue: ['1', '2', '3'] }),
      selected: stringProp(),
      direction: stringDropdownProp({
        defaultValue: 'vertical',
        options: ['vertical', 'horizontal'],
      }),
    },
  },
  ({ setProperty, direction, disabled, options, selected, label }) => {
    return (
      <FormControl>
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup row={direction === 'horizontal'}>
          {(options ?? []).map((option) => {
            return (
              <FormControlLabel
                key={option}
                value={option}
                control={
                  <Radio
                    size="small"
                    checked={selected === option}
                    onChange={(ev) => {
                      const checked = ev.target.checked;
                      if (checked) {
                        setProperty('selected', option);
                      }
                    }}
                  />
                }
                label={option}
                disabled={disabled}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  },
);
