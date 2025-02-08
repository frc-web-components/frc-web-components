import { Nt4Provider } from '@frc-web-components/fwc/source-providers';
import { dashboardElementConfigs, FrcDashboard } from '@frc-web-components/fwc';
import { Store } from '@webbitjs/store';
import { setContext, getContext, onDestroy } from 'svelte';
import { writable } from 'svelte/store';

export function setNt4Context(address: string) {
  const dashboard = new FrcDashboard(document.body);
  const provider = new Nt4Provider();
  dashboard.addSourceProvider('NetworkTables', provider);
  dashboard.setDefaultSourceProvider('NetworkTables');
  dashboard.addElements(dashboardElementConfigs, 'FRC');
  provider.connect(address);

  setContext('NT4', {
    store: dashboard.getStore(),
    provider,
  });
}

export function getNt4Context(): { store: Store; provider: Nt4Provider } {
  return getContext('NT4');
}

export function addGlobalListener(
  callback: (key: string, value: unknown) => unknown,
  immediateNotify: boolean,
) {
  const { store } = getNt4Context();

  const unsubscribe = store.subscribeAll(
    'NetworkTables',
    (value: unknown, key: string) => {
      callback(key, value);
    },
    immediateNotify,
  );

  onDestroy(unsubscribe);
}

export function addKeyListener<T>(
  key: string,
  callback: (key: string, value: T) => unknown,
  immediateNotify: boolean,
) {
  const { store } = getNt4Context();

  const unsubscribe = store.subscribe(
    'NetworkTables',
    key,
    (value: unknown) => {
      callback(key, value as T);
    },
    immediateNotify,
  );

  onDestroy(unsubscribe);
}

export function getEntry<T>(key: string, defaultValue: T) {
  const { provider } = getNt4Context();
  const { subscribe, set } = writable(defaultValue);

  addKeyListener<T>(
    key,
    (_, newValue) => {
      if (newValue === undefined) {
        set(defaultValue);
      } else {
        set(newValue);
      }
    },
    true,
  );

  return {
    subscribe,
    setValue: (value: T) => provider.userUpdate(key, value),
  };
}

export function getJson(key: string, defaultValue?: unknown) {
  const { store } = getNt4Context();
  const { subscribe, set } = writable(defaultValue);

  addKeyListener(
    key,
    () => {
      const json = store.getSource('NetworkTables', key)?.getJson();
      set(json);
    },
    true,
  );

  return {
    subscribe,
  };
}
