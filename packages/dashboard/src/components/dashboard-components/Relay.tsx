import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { createComponent, stringDropdownProp } from './fromProps';
import { CSSProperties } from 'react';

const options = ['Off', 'On', 'Forward', 'Reverse'];

export const relay = createComponent(
  {
    dashboard: {
      name: 'Relay',
      description: '',
      defaultSize: { width: 100, height: 180 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String'],
    primaryProperty: 'value',
    properties: {
      value: stringDropdownProp({
        defaultValue: 'Off',
        options,
      }),
      direction: stringDropdownProp({
        defaultValue: 'vertical',
        options: ['vertical', 'horizontal'],
      }),
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
    },
  },
  ({ value, direction, color, setProperty }) => {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ToggleButtonGroup
          style={{
            width: '100%',
            height: '100%',
            borderWidth: 2,
          }}
          orientation={direction as any}
          value={value}
          exclusive
          color={color as any}
          onChange={(_, value: string) => {
            setProperty('value', value);
          }}
        >
          {options.map((option) => {
            const style: CSSProperties = {
              flex: '1',
            };
            if (value !== option) {
              style.background = '#111';
            }

            return (
              <ToggleButton key={option} value={option} style={style}>
                {option}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </div>
    );
  },
);
