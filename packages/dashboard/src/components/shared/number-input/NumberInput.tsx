import { useEffect, useState } from 'react';

import { AddCircle, RemoveCircle } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  Typography,
} from '@mui/material';
// import { Property as CSSProperty } from 'csstype';

import { clampNumber, generateNumberRegex, getFormControlProps } from './utils';

interface NumberInputProps extends Omit<OutlinedInputProps, 'onChange'> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  decimalScale?: number;
  unit?: string;
  singularUnit?: string;
  helperText?: string;
  // textAlign?: CSSProperty.TextAlign;
  hideActionButtons?: boolean;
  onChange?: (value: number) => void;
}

// https://gist.github.com/nameer/664abb9d4e261a210de1f1ba814a0ad2
const NumberInput: React.FC<NumberInputProps> = ({
  value,
  min = 0,
  max = Infinity,
  step = 1,
  decimalScale = 0,
  unit,
  singularUnit: singleUnit,
  helperText,
  // textAlign = 'center',
  hideActionButtons = false,
  onChange,
  ...props
}) => {
  const [, setErrorMessage] = useState<string | undefined>('');
  const [stateValue, setStateValue] = useState(value?.toString());

  // Allow decimal if any of props is decimal
  // num can be Infinity: num%1 || 0
  // num%1 can give numbers like 0 and 0.1: hence length-2
  // decimalScale cannot be negative: floor to 0 with Max
  const propDecimalScale = Math.max(
    ...[min, max, step].map((num) => (num % 1 || 0).toString().length - 2),
    0,
  );
  const allowDecimal = decimalScale > 0 || propDecimalScale > 0;
  // Update decimalScale to allow decimal
  decimalScale = decimalScale > 0 ? decimalScale : propDecimalScale;
  // Regex to match value with
  const numberRegex = generateNumberRegex(min, max, allowDecimal);

  const formatValue = (val: any) => clampNumber(val, min, max, decimalScale);
  const getKeyDownChar = (e: React.KeyboardEvent): string | undefined => {
    /* Returns the event's key if it's a character. */

    if (e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.key === 'ArrowUp') {
      updateValue(step)();
      return;
    } else if (e.key === 'ArrowDown') {
      updateValue(-step)();
      return;
    }
    const char = e.key;
    if (char.length > 1)
      // Not character
      return;
    const charCode = char.charCodeAt(0);
    if (charCode < 32 || (charCode > 126 && charCode < 160) || charCode > 255)
      // Not printable character
      return;
    return char;
  };

  const internalValue =
    formatValue(stateValue).toString() === stateValue && value !== undefined
      ? formatValue(value).toString()
      : stateValue;

  const updateChange = (value: string) => {
    setStateValue(value);
    setErrorMessage(undefined);
    const formattedValue = formatValue(value);
    if (formattedValue.toString() === value) onChange?.(formattedValue);
  };
  const updateValue = (diff: number) => () =>
    updateChange(formatValue(formatValue(internalValue) + diff).toString());
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateChange(e.target.value);
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData?.getData('Text');
    if (!text?.trim().match(numberRegex)) {
      setErrorMessage('Invalid input');
      e.preventDefault();
    } else if (Number(!text?.trim()) < min) {
      setErrorMessage('Minimum value is ' + min);
      e.preventDefault();
    } else if (Number(!text?.trim()) > max) {
      setErrorMessage('Maximum value is ' + max);
      e.preventDefault();
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    updateChange(formatValue(e.target.value).toString());
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = getKeyDownChar(e);
    if (!char)
      // No character
      return;
    const target = e.target as HTMLInputElement;
    if (target.selectionStart == null || target.selectionEnd == null)
      // No selection
      return;
    const resultingStr =
      target.value.substring(0, target.selectionStart) +
      char +
      target.value.substring(target.selectionEnd);
    if (!resultingStr.match(numberRegex)) {
      setErrorMessage('Invalid input');
      e.preventDefault();
    } else if (Number(resultingStr) < min) {
      setErrorMessage('Minimum value is ' + min);
      e.preventDefault();
    } else if (Number(resultingStr) > max) {
      setErrorMessage('Maximum value is ' + max);
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (typeof value === 'number') {
      updateChange(value?.toString());
    }
  }, [value]);

  props ??= {};
  props.inputProps ??= {};
  props.inputProps.style ??= {};
  props.inputProps.style.textAlign ??= 'center'; //textAlign;
  props.placeholder ??= Math.min(max, Math.max(min, 0)).toString();
  const formControlProps = getFormControlProps(props);

  hideActionButtons = hideActionButtons || props.readOnly || false;

  singleUnit ??= unit;
  unit ??= singleUnit;

  return (
    <Box>
      <FormControl {...formControlProps} variant="outlined">
        <InputLabel shrink htmlFor="number-input">
          {props.label}
        </InputLabel>
        <OutlinedInput
          notched
          error={
            props.error || Number(stateValue) < min || Number(stateValue) > max
          }
          {...props}
          value={internalValue}
          id="number-input"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          startAdornment={
            !hideActionButtons ? (
              <InputAdornment position="start">
                <IconButton
                  aria-label="decrease value"
                  onClick={updateValue(-step)}
                  edge="start"
                  disabled={props.disabled || formatValue(internalValue) <= min}
                >
                  <RemoveCircle />
                </IconButton>
              </InputAdornment>
            ) : undefined
          }
          endAdornment={
            (unit || !hideActionButtons) && (
              <InputAdornment position="end">
                {unit && (
                  <Typography className="cursor-default select-none">
                    {formatValue(internalValue) === 1 ? singleUnit : unit}
                  </Typography>
                )}
                {!hideActionButtons && (
                  <IconButton
                    aria-label="increase value"
                    onClick={updateValue(step)}
                    edge="end"
                    disabled={
                      props.disabled || formatValue(internalValue) >= max
                    }
                    color={undefined}
                    sx={{
                      '&:hover': {
                        color: (theme) =>
                          props.color || theme.palette.primary.main,
                      },
                      '&:focus': {
                        color: (theme) =>
                          props.color || theme.palette.primary.main,
                      },
                      transition: (theme) => theme.transitions.create('color'),
                    }}
                  >
                    <AddCircle />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default NumberInput;
