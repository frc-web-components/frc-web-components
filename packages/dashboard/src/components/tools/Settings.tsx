import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Grid, Typography } from '@mui/material';
import NumberInput from '../shared/number-input/NumberInput';
import { useDashboardTheme, useSourceProvider } from '@/dashboard';
import { NT4Provider } from '@store/sources/nt4';
import { useAppDispatch, useAppSelector } from '@store/app/hooks';
import {
  selectGridGap,
  selectGridSize,
  selectGridPadding,
} from '@store/selectors/layoutSelectors';
import {
  setGridGap,
  setGridSize,
  setGridPadding,
} from '@store/slices/layoutSlice';

const addressOptions = ['localhost'];
const themeOptions = [{ label: 'dark' }, { label: 'light' }];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Settings() {
  const [address, setAddress] = useState('localhost');
  const gridSize = useAppSelector(selectGridSize);
  const gridGap = useAppSelector(selectGridGap);
  const gridPadding = useAppSelector(selectGridPadding);
  const { providers } = useSourceProvider();
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useDashboardTheme();

  useEffect(() => {
    (providers['NT'] as NT4Provider).connect(address);
  }, [address]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, padding: '10px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Dashboard Settings
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="size-small-outlined"
              size="small"
              options={themeOptions}
              freeSolo
              defaultValue={theme as any}
              onChange={(_, value) => {
                if (value) {
                  setTheme(value.label);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Theme" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="size-small-outlined"
              size="small"
              options={addressOptions}
              freeSolo
              defaultValue={address}
              onChange={(_, value) => {
                if (value) {
                  setAddress(value);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Team/IP" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <NumberInput
              fullWidth
              value={gridSize}
              size="small"
              label="Grid Cell Size"
              style={{ width: '100%' }}
              onChange={(value) => {
                dispatch(setGridSize(value));
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <NumberInput
              fullWidth
              value={gridGap}
              size="small"
              label="Grid Cell Gap"
              style={{ width: '100%' }}
              onChange={(value) => {
                dispatch(setGridGap(value));
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <NumberInput
              fullWidth
              value={gridPadding}
              size="small"
              label="Grid Padding"
              style={{ width: '100%' }}
              onChange={(value) => {
                dispatch(setGridPadding(value));
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
