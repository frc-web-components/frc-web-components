import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  booleanProp,
  createComponent,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from './fromProps';
import { CSSProperties } from 'react';

export const toggleButton = createComponent(
  {
    dashboard: {
      name: 'Toggle Button',
      description: '',
      defaultSize: { width: 100, height: 100 },
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
    },
  },
  ({ toggled, label, color, setProperty }) => {
    const styles: CSSProperties = {
      width: '100%',
      height: '100%',
      borderWidth: 2,
    };
    if (!toggled) {
      styles.background = '#111';
    }
    return (
      <ToggleButton
        style={styles}
        color={color as any}
        selected={toggled}
        onChange={() => {
          setProperty('toggled', !toggled);
        }}
        value=""
      >
        {label}
      </ToggleButton>
    );
  },
);

export const toggleGroup = createComponent(
  {
    dashboard: {
      name: 'Toggle Group',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String[]'],
    primaryProperty: 'value',
    properties: {
      value: stringArrayProp(),
      options: stringArrayProp({ defaultValue: ['On', 'Off'] }),
      exclusive: booleanProp(),
      enforceValueSet: booleanProp(),
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
  ({ value, direction, exclusive, options, color, setProperty }) => {
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
          exclusive={exclusive}
          color={color as any}
          onChange={(_, values: string[] | string) => {
            setProperty(
              'value',
              typeof values === 'string' ? [values] : values,
            );
          }}
        >
          {(options ?? []).map((option) => {
            const style: CSSProperties = {
              flex: '1',
            };
            if (!value.includes(option)) {
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
