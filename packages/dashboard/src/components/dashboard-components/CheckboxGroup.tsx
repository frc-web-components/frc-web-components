import {
  booleanProp,
  createComponent,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from './fromProps';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

export const checkboxGroup = createComponent(
  {
    dashboard: {
      name: 'Checkbox Group',
      description: '',
      defaultSize: { width: 60, height: 120 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String[]'],
    primaryProperty: 'selected',
    properties: {
      disabled: booleanProp(),
      label: stringProp(),
      options: stringArrayProp({ defaultValue: ['1', '2', '3'] }),
      selected: stringArrayProp(),
      direction: stringDropdownProp({
        defaultValue: 'vertical',
        options: ['vertical', 'horizontal'],
      }),
    },
  },
  ({ setProperty, direction, disabled, options, selected, label }) => {
    return (
      <>
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup row={direction === 'horizontal'}>
          {(options ?? []).map((option) => {
            return (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    size="small"
                    checked={selected.includes(option)}
                    onChange={(ev) => {
                      const checked = ev.target.checked;
                      const updatedSelected = new Set(selected);
                      if (checked) {
                        updatedSelected.add(option);
                      } else {
                        updatedSelected.delete(option);
                      }
                      setProperty('selected', [...updatedSelected]);
                    }}
                  />
                }
                label={option}
                disabled={disabled}
              />
            );
          })}
        </FormGroup>
      </>
    );
  },
);
