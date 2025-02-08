import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { booleanProp, createComponent } from '../fromProps';

function getState(auto: boolean, enabled: boolean, test: boolean) {
  if (!auto && !test && enabled) {
    return 'teleop';
  }
  if (auto && !test && enabled) {
    return 'auto';
  }
  if (!auto && test && enabled) {
    return 'test';
  }
  if (!enabled) {
    return 'disabled';
  }
  return '';
}

export const robotState = createComponent(
  {
    dashboard: {
      name: 'Robot State',
      description: '',
      defaultSize: { width: 106, height: 138 },
      minSize: { width: 106, height: 138 },
    },
    defaultSource: {
      key: '/DriverStation',
      provider: 'Sim',
    },
    acceptedSourceTypes: ['DriverStation'],
    properties: {
      enabled: booleanProp(),
      autonomous: booleanProp(),
      test: booleanProp(),
    },
  },
  ({ autonomous, enabled, test, setProperty }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement).value;
      if (value === 'disabled') {
        setProperty('enabled', false);
        setProperty('autonomous', false);
        setProperty('test', false);
      } else if (value === 'auto') {
        setProperty('enabled', true);
        setProperty('autonomous', true);
        setProperty('test', false);
      } else if (value === 'teleop') {
        setProperty('enabled', true);
        setProperty('autonomous', false);
        setProperty('test', false);
      } else if (value === 'test') {
        setProperty('enabled', true);
        setProperty('autonomous', false);
        setProperty('test', true);
      }
    };
    return (
      <FormControl>
        <FormLabel>Robot State</FormLabel>
        <RadioGroup
          value={getState(autonomous, enabled, test)}
          onChange={handleChange}
        >
          <FormControlLabel
            value="disabled"
            control={
              <Radio
                size="small"
                sx={{ paddingTop: '7px', paddingBottom: '4px' }}
              />
            }
            label="Disabled"
          />
          <FormControlLabel
            value="auto"
            control={
              <Radio
                size="small"
                sx={{ paddingTop: '4px', paddingBottom: '4px' }}
              />
            }
            label="Auto"
          />
          <FormControlLabel
            value="teleop"
            control={
              <Radio
                size="small"
                sx={{ paddingTop: '4px', paddingBottom: '4px' }}
              />
            }
            label="Teleop"
          />
          <FormControlLabel
            value="test"
            control={
              <Radio
                size="small"
                sx={{ paddingTop: '4px', paddingBottom: '4px' }}
              />
            }
            label="Test"
          />
        </RadioGroup>
      </FormControl>
    );
  },
);
