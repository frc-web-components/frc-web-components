import {
  setLayout,
  addComponent,
  removeComponent,
  clearTab,
  updateComponentType,
  updateComponentPropertySource,
  updateComponentSource,
  Layout,
} from '@/store/slices/layoutSlice';
import { NT4Provider as Provider } from './provider';
import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import {
  toggleEditing,
  setEditing,
  AppSliceState,
} from '@/store/slices/appSlice';

export type NT4Provider = Provider;

let nt4Provider: NT4Provider;

export function getNt4Provider() {
  if (!nt4Provider) {
    nt4Provider = new Provider();
  }
  return nt4Provider;
}

export const nt4EditingMiddleware: Middleware =
  (storeAPI: MiddlewareAPI) => (next) => (action) => {
    const result = next(action);

    if (toggleEditing.match(action) || setEditing.match(action)) {
      const state = storeAPI.getState();
      const app = state.app as AppSliceState;
      if (app) {
        const provider = getNt4Provider();
        provider.setEditing(app.editing);
      }
    }
    return result;
  };

// Define the middleware
export const nt4SubscriptionMiddleware: Middleware =
  (storeAPI: MiddlewareAPI) => (next) => (action) => {
    const updateProviderSources = [
      setLayout,
      addComponent,
      removeComponent,
      clearTab,
      updateComponentType,
      updateComponentPropertySource,
      updateComponentSource,
    ].some((layoutAction) => layoutAction.match(action));

    if (!updateProviderSources) {
      return next(action);
    }

    const result = next(action);

    const state = storeAPI.getState();
    const layout = state.layout as Layout;

    if (!layout) {
      return result;
    }

    const ntKeys = new Set<string>();

    const updateNtKeys = (
      source:
        | {
            provider: string;
            key: string;
          }
        | undefined,
    ) => {
      if (source?.provider !== 'NT') {
        return;
      }
      ntKeys.add(source.key);
    };

    Object.values(layout.components).forEach((component) => {
      updateNtKeys(component.source);
      Object.values(component.properties).forEach(({ source }) => {
        updateNtKeys(source);
      });
    });

    const provider = getNt4Provider();
    provider.setSubscriptions(ntKeys);

    return result;
  };
