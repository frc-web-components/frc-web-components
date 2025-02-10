import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/app/store';
import { DropZoneProvider } from './components/context-providers/DropZoneContext.tsx';
import { componentMap } from './components/dashboard-components/index.ts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard, { ComponentConfig } from './dashboard.ts';
import './index.module.scss';
import { Layout } from './store/slices/layoutSlice.ts';
import ShuffleboardLayout from './plugins/shuffleboard-layout.ts';
import { getNt4Provider } from '@store/sources/nt4';
// import { SimProvider } from '@store/sources/sim';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const dashboard = new Dashboard();
dashboard.addComponents(componentMap);
dashboard.addSourceProvider('NT', getNt4Provider());
// dashboard.addSourceProvider('Sim', new SimProvider());

new ShuffleboardLayout(dashboard);

export function mountDashboard(element: HTMLElement) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <DropZoneProvider>
            <App />
          </DropZoneProvider>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}

export function addComponents(components: Record<string, ComponentConfig>) {
  dashboard.addComponents(components);
}

export function getDashboard() {
  return dashboard;
}

let assetBasePath = '';

export function setAssetBasePath(path: string) {
  assetBasePath = path;
}

export function getAssetBasePath() {
  return assetBasePath;
}

export function getAssetUrl(relativePath: string): string {
  return `${assetBasePath.replace(/\/$/, '')}/${relativePath.replace(
    /^\//,
    '',
  )}`;
}

export function addExample(name: string, layout: Layout) {
  dashboard.addExample(name, layout);
}

export function addThemeRules(
  theme: string,
  cssVariables: Record<string, string>,
) {
  dashboard.addThemeRules(theme, cssVariables);
}

export function setTheme(theme: string) {
  dashboard.setTheme(theme);
}

export function getTheme() {
  return dashboard.getTheme();
}

export {
  createComponent,
  createWebComponent,
  booleanProp,
  colorProp,
  markdownProp,
  numberArrayProp,
  numberProp,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from './components/dashboard-components/fromProps';

mountDashboard(document.getElementById('root')!);
