import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../app/createAppSlice';
import { layoutJson as defaultLayoutJson } from './layout';
import { IJsonModel, IJsonRowNode, IJsonTabSetNode } from 'flexlayout-react';
import { v4 as uuidv4 } from 'uuid';

function findTabset(
  node: IJsonRowNode | IJsonTabSetNode,
): IJsonTabSetNode | undefined {
  if (node.type === 'tabset') {
    return node;
  }
  for (const child of node.children) {
    const tabset = findTabset(child);
    if (tabset) {
      return tabset;
    }
  }
  return undefined;
}

export interface Component {
  id: string;
  type: string;
  name: string;
  source?: {
    provider: string;
    key: string;
  };
  properties: {
    [propertName: string]: {
      value: unknown;
      temporaryValue?: unknown;
      source?: {
        provider: string;
        key: string;
      };
    };
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  parent?: string;
  children: string[];
}

export interface Layout {
  selectedComponentId?: string;
  flexLayout: IJsonModel;
  components: {
    [componentId: string]: Component;
  };
  tabs: {
    [tabId: string]: {
      componentIds: string[];
    };
  };
  gridSize: number;
  gridGap: number;
  gridPadding: number;
}

export const initialLayoutState: Layout = {
  selectedComponentId: undefined,
  flexLayout: defaultLayoutJson,
  components: {},
  tabs: {},
  gridSize: 50,
  gridGap: 5,
  gridPadding: 5,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const layoutSlice = createAppSlice({
  name: 'layout',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: initialLayoutState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setLayout: create.reducer((state, action: PayloadAction<Layout>) => {
      state.flexLayout = action.payload.flexLayout;
      state.components = action.payload.components;
      state.tabs = action.payload.tabs;
      state.gridSize = action.payload.gridSize;
      state.gridGap = action.payload.gridGap;
      state.gridPadding = action.payload.gridPadding;
    }),
    setFlexLayout: create.reducer(
      (state, action: PayloadAction<IJsonModel>) => {
        state.flexLayout = action.payload;
      },
    ),
    setSelectedComponent: create.reducer(
      (state, action: PayloadAction<string | undefined>) => {
        state.selectedComponentId = action.payload;
      },
    ),
    addComponent: create.reducer(
      (
        state,
        action: PayloadAction<{ component: Component; tabId: string }>,
      ) => {
        const { component, tabId } = action.payload;
        const parentComponent = component.parent
          ? state.components[component.parent]
          : undefined;
        if (component.parent && !parentComponent) {
          return;
        }
        parentComponent?.children.push(component.id);

        state.components[component.id] = component;
        if (!state.tabs[tabId]) {
          state.tabs[tabId] = {
            componentIds: [],
          };
        }
        state.tabs[tabId].componentIds.push(component.id);
      },
    ),
    removeComponent: create.reducer(
      (state, action: PayloadAction<{ componentId: string }>) => {
        const { componentId } = action.payload;
        const component = state.components[componentId];
        const tabId = Object.keys(state.tabs).find((id) => {
          return state.tabs[id].componentIds.includes(componentId);
        });

        const componentIds = new Set(
          tabId ? state.tabs[tabId].componentIds : [],
        );

        if (componentId === state.selectedComponentId) {
          state.selectedComponentId = undefined;
        }
        if (component) {
          if (component.parent) {
            const children = state.components[component.parent].children;
            children.splice(children.indexOf(componentId), 1);
          }
          component.children.forEach((child) => {
            delete state.components[child];
            componentIds.delete(child);

            if (state.selectedComponentId === child) {
              state.selectedComponentId = undefined;
            }
          });
          componentIds.delete(componentId);
          delete state.components[componentId];
        }
        if (tabId) {
          state.tabs[tabId].componentIds = [...componentIds];
        }
      },
    ),
    clearTab: create.reducer(
      (state, action: PayloadAction<{ tabId: string }>) => {
        const { tabId } = action.payload;
        const tab = state.tabs[tabId];
        if (!tab) {
          return;
        }
        tab.componentIds.forEach((componentId) => {
          delete state.components[componentId];
        });
        tab.componentIds = [];
        state.selectedComponentId = undefined;
      },
    ),
    setComponentName: create.reducer(
      (state, action: PayloadAction<{ componentId: string; name: string }>) => {
        const { componentId, name } = action.payload;
        state.components[componentId].name = name;
      },
    ),

    updateComponentType: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          type: string;
          properties: {
            [propertName: string]: {
              value: unknown;
              source?: {
                provider: string;
                key: string;
              };
            };
          };
          name: string;
        }>,
      ) => {
        const { componentId, type, properties, name } = action.payload;
        if (!state.components[componentId]) {
          return;
        }
        state.components[componentId].type = type;
        state.components[componentId].properties = properties;
        state.components[componentId].name = name;
      },
    ),
    updateComponentSize: create.reducer(
      (
        state,
        action: PayloadAction<{ id: string; width: number; height: number }>,
      ) => {
        const { id, width, height } = action.payload;
        state.components[id].size = { width, height };
      },
    ),
    updateComponentPosition: create.reducer(
      (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
        const { id, x, y } = action.payload;
        state.components[id].position = { x, y };
      },
    ),
    setComponentTemporaryValue: create.reducer(
      (
        state,
        action: PayloadAction<{ id: string; value: unknown; property: string }>,
      ) => {
        const { id, value, property } = action.payload;
        state.components[id].properties[property].temporaryValue = value;
      },
    ),
    updateComponentProperty: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          propertyName: string;
          propertyValue: unknown;
        }>,
      ) => {
        const { componentId, propertyName, propertyValue } = action.payload;
        state.components[componentId].properties[propertyName].value =
          propertyValue;
      },
    ),
    updateComponentPropertySource: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          propertyName: string;
          source?: {
            provider: string;
            key: string;
          };
        }>,
      ) => {
        const { componentId, propertyName, source } = action.payload;
        state.components[componentId].properties[propertyName].source = source;
      },
    ),
    updateComponentSource: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          source?: {
            provider: string;
            key: string;
          };
        }>,
      ) => {
        const { componentId, source } = action.payload;
        state.components[componentId].source = source;
      },
    ),
    setGridSize: create.reducer((state, action: PayloadAction<number>) => {
      state.gridSize = action.payload;
    }),
    setGridGap: create.reducer((state, action: PayloadAction<number>) => {
      state.gridGap = action.payload;
    }),
    setGridPadding: create.reducer((state, action: PayloadAction<number>) => {
      state.gridPadding = action.payload;
    }),
    addTab: create.reducer((state, action: PayloadAction<string>) => {
      const tabName = action.payload;
      const tabset = findTabset(state.flexLayout.layout);
      if (tabset) {
        tabset.children.push({
          id: uuidv4(),
          name: tabName,
        });
      }
    }),
  }),
});

// Action creators are generated for each case reducer function.
export const {
  setLayout,
  setFlexLayout,
  setSelectedComponent,
  addComponent,
  removeComponent,
  clearTab,
  updateComponentPosition,
  updateComponentSize,
  updateComponentProperty,
  updateComponentPropertySource,
  updateComponentSource,
  updateComponentType,
  setComponentName,
  setComponentTemporaryValue,
  setGridSize,
  setGridGap,
  setGridPadding,
  addTab,
} = layoutSlice.actions;
