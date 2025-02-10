import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { store } from '@store/app/store';
import {
  Layout,
  setLayout,
  initialLayoutState,
  addTab,
  addComponent,
} from '@store/slices/layoutSlice';
import exampleLayout from './example-layouts/example';
import { v4 as uuidv4 } from 'uuid';
import { IJsonRowNode, IJsonTabNode, IJsonTabSetNode } from 'flexlayout-react';
import { atom, getDefaultStore, useAtom } from 'jotai';
import SourceProvider from '@store/sources/source-provider';
import {
  selectSource,
  selectSourceValue,
} from '@store/selectors/sourceSelectors';
import { DashboardThemes, darkTheme } from '@frc-web-components/fwc/themes';
import { useEffect, useState } from 'react';

export type SourceInfo =
  | {
      type: 'source';
      source: {
        provider: string;
        key: string;
      };
    }
  | {
      type: 'sourceProperty';
      source: {
        provider: string;
        key: string;
        property: string;
      };
    }
  | {
      type: 'defaultValue';
    };

export interface ComponentProperty {
  type:
    | 'Number'
    | 'String'
    | 'Boolean'
    | 'Object'
    | 'Number[]'
    | 'String[]'
    | 'Boolean[]'
    | 'Object[]';
  defaultValue: unknown;
  input?: {
    type: string;
    [props: string]: unknown;
  };
  tooltip?: string;
}

export interface ChildComponentConfig {
  type: string;
  propertyTabName?: string;
}

export interface ComponentConfig {
  dashboard: {
    name: string;
    description: string;
    defaultSize: {
      width: number;
      height: number;
    };
    minSize: {
      width: number;
      height: number;
    };
    topLevel?: boolean;
    children?: {
      type: string;
      name: string;
      properties?: Record<string, unknown>;
    }[];
  };
  defaultSource?: {
    key: string;
    provider: string;
  };
  acceptedSourceTypes?: string[];
  primaryProperty?: string;
  properties: Record<string, ComponentProperty>;
  component: React.ComponentType<any>;
  children?: ChildComponentConfig[];
}

interface DashboardEvents {
  addComponentsEvent: (components: Record<string, ComponentConfig>) => void;
  setLayoutEvent: (layout: Layout) => void;
  newDashboardMenuClickEvent: () => void;
  newWindowMenuClickEvent: () => void;
  openDashboardMenuClickEvent: () => void;
  saveDashboardMenuClickEvent: () => void;
  saveDashboardAsMenuClickEvent: () => void;
  pluginsMenuClickEvent: () => void;
  closeWindowMenuClickEvent: () => void;
  quitMenuClickEvent: () => void;
  closeWindowClickEvent: () => void;
  minimizeWindowClickEvent: () => void;
  maximizeWindowClickEvent: () => void;
  setLoadedPluginsEvent: (plugins: Plugin[]) => void;
  pluginDialogRemoveEvent: (location: string) => void;
  pluginDialogLoadPluginEvent: () => void;
  dashboardTitleChange: (title: string) => void;
  exampleAdd: () => void;
  themeChangeEvent: (theme: string) => void;
}

export type DashboardEventEmitter = StrictEventEmitter<
  EventEmitter,
  DashboardEvents
>;

export interface Plugin {
  name: string;
  description: string;
  version: string;
  location: string;
}

const dashboardAtom = atom<Dashboard | undefined>(undefined);
const componentsAtom = atom<Record<string, ComponentConfig>>({});
const sourceProviderAtom = atom<Record<string, SourceProvider>>({});

export default class Dashboard extends (EventEmitter as unknown as new () => DashboardEventEmitter) {
  #loadedPlugins: Plugin[] = [];
  #title = 'Untitled Dashboard';
  #exampleDashboards: {
    name: string;
    layout: Layout;
  }[] = [{ name: 'YAGSL Swerve', layout: exampleLayout }];
  #store = getDefaultStore();
  #themes = new DashboardThemes();

  constructor() {
    super();
    this.#store.set(dashboardAtom, this);
    this.#themes.addThemeRules('dark', darkTheme);
    this.#themes.setTheme(document.body, 'dark');
  }

  addThemeRules(theme: string, cssVariables: Record<string, string>) {
    this.#themes.addThemeRules(theme, cssVariables);
  }

  setTheme(theme: string) {
    this.#themes.setTheme(document.body, theme);
    this.emit('themeChangeEvent', theme);
  }

  getTheme() {
    return this.#themes.getTheme(document.body);
  }

  setTitle(title: string) {
    this.#title = title;
    this.emit('dashboardTitleChange', title);
  }

  getTitle() {
    return this.#title;
  }

  addComponents(components: Record<string, ComponentConfig>) {
    this.#store.set(componentsAtom, (value) => {
      return {
        ...value,
        ...components,
      };
    });
    this.emit('addComponentsEvent', this.#store.get(componentsAtom));
  }

  getComponents() {
    return this.#store.get(componentsAtom);
  }

  getLayout(): Layout {
    const layout = { ...store.getState().layout };
    delete layout.selectedComponentId;
    return layout;
  }

  setLayout(layout: Layout) {
    store.dispatch(setLayout(layout));
  }

  resetLayout() {
    this.setLayout(initialLayoutState);
  }

  setLoadedPlugins(plugins: Plugin[]) {
    this.#loadedPlugins = plugins;
    this.emit('setLoadedPluginsEvent', plugins);
  }

  getLoadedPlugins() {
    return this.#loadedPlugins;
  }

  addExample(name: string, layout: Layout) {
    this.#exampleDashboards.push({ name, layout });
    this.emit('exampleAdd');
  }

  getExamples() {
    return [...this.#exampleDashboards];
  }

  addTab(name: string) {
    store.dispatch(addTab(name));
  }

  #findTabByName(
    name: string,
    node: IJsonRowNode | IJsonTabSetNode,
  ): IJsonTabNode | undefined {
    if (node.type === 'tabset') {
      return node.children.find((childTab) => childTab.name === name);
    }
    for (const child of node.children) {
      const tab = this.#findTabByName(name, child);
      if (tab) {
        return tab;
      }
    }
    return undefined;
  }

  getTab(name: string): IJsonTabNode | undefined {
    const { flexLayout } = store.getState().layout;
    return this.#findTabByName(name, flexLayout.layout);
  }

  addElementToTab(
    tabName: string,
    element: {
      type: string;
      name?: string;
      size: { width: number; height: number };
      position: { x: number; y: number };
      source?: {
        provider: string;
        key: string;
      };
      properties?: {
        [propertName: string]: {
          value: unknown;
          source?: {
            provider: string;
            key: string;
          };
        };
      };
    },
  ) {
    const { type, name, properties, size, position } = element;
    const componentConfig = this.getComponents()[type];
    const tab = this.getTab(tabName);
    if (!componentConfig || !tab) {
      return;
    }
    const elementId = uuidv4();
    const props = properties ?? {};
    Object.entries(componentConfig.properties).forEach(([name, prop]) => {
      props[name] = {
        value: prop.defaultValue,
      };
    });

    const { gridSize } = store.getState().layout;
    const minWidth = Math.ceil(
      componentConfig.dashboard.minSize.width / gridSize,
    );
    const minHeight = Math.ceil(
      componentConfig.dashboard.minSize.height / gridSize,
    );

    store.dispatch(
      addComponent({
        tabId: tab.id!,
        component: {
          id: elementId,
          children: [],
          source: element.source ?? componentConfig.defaultSource,
          minSize: { width: minWidth, height: minHeight },
          size,
          position,
          properties: props,
          type,
          name: name ?? componentConfig.dashboard.name,
        },
      }),
    );
  }

  addSourceProvider(name: string, provider: SourceProvider) {
    this.#store.set(sourceProviderAtom, (value) => ({
      ...value,
      [name]: provider,
    }));
  }
}

const setSourceValue = (value: unknown, sourceInfo: SourceInfo) => {
  const providers = getDefaultStore().get(sourceProviderAtom);
  if (sourceInfo.type === 'source') {
    const source = selectSource(
      store.getState(),
      sourceInfo.source.provider,
      sourceInfo.source.key,
    )!;
    const provider = providers[sourceInfo.source.provider];
    if (provider) {
      provider.componentUpdate(sourceInfo.source.key, value, source.type!);
    }
  } else if (sourceInfo.type === 'sourceProperty') {
    const source = selectSource(
      store.getState(),
      sourceInfo.source.provider,
      sourceInfo.source.key,
    )!;
    const sourceValue = selectSourceValue(
      store.getState(),
      sourceInfo.source.provider,
      sourceInfo.source.key,
    );
    const provider = providers[sourceInfo.source.provider];
    if (provider) {
      const property = sourceInfo.source.property;
      const newValue = {
        ...(sourceValue as any),
        [property]: value,
      };
      provider.componentUpdate(sourceInfo.source.key, newValue, source.type!);
    }
  }
};

export const useDashboard = () => {
  const [dashboard] = useAtom(dashboardAtom);
  if (!dashboard) {
    throw new Error('Dashboard not set');
  }
  return dashboard;
};

export const useComponentConfigs = () => useAtom(componentsAtom);

export const useSourceProvider = () => {
  const [providers] = useAtom(sourceProviderAtom);
  return {
    providers,
    setSourceValue,
  };
};

export const useDashboardTheme = (): [
  string | undefined,
  (theme: string) => void,
] => {
  const dashboard = useDashboard();
  const [theme, setTheme] = useState(dashboard.getTheme());

  useEffect(() => {
    dashboard.on('themeChangeEvent', setTheme);
    return () => {
      dashboard.off('themeChangeEvent', setTheme);
    };
  }, []);

  return [theme, (theme: string) => dashboard.setTheme(theme)];
};
