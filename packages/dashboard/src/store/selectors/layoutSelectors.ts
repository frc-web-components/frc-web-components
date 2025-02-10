import { RootState } from '../app/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectFlexLayout = (state: RootState) => state.layout.flexLayout;

export const selectSelectedComponentId = (state: RootState) =>
  state.layout.selectedComponentId;
export const selectComponents = (state: RootState) => state.layout.components;

export const selectTab = (state: RootState, tabId: string) =>
  state.layout.tabs[tabId];

export const selectComponent = (state: RootState, componentId?: string) =>
  componentId ? state.layout.components[componentId] : undefined;

export const selectGridSize = (state: RootState) => state.layout.gridSize;
export const selectGridGap = (state: RootState) => state.layout.gridGap;
export const selectGridPadding = (state: RootState) => state.layout.gridPadding;

export function makeSelectTabComponents() {
  return createSelector([selectTab, selectComponents], (tab, components) => {
    return tab?.componentIds
      .map((id) => components[id])
      .filter((component) => !component.parent);
  });
}

export function makeSelectSelectedComponent() {
  return createSelector(
    [selectSelectedComponentId, selectComponents],
    (selectedComponentId, components) => {
      if (!selectedComponentId) {
        return undefined;
      }
      return components[selectedComponentId];
    },
  );
}

export function makeSelectSelectedComponentChildren() {
  return createSelector(
    [selectSelectedComponentId, selectComponents],
    (selectedComponentId, components) => {
      if (!selectedComponentId) {
        return undefined;
      }
      const selectedComponent = components[selectedComponentId];
      return selectedComponent?.children.map((childId) => components[childId]);
    },
  );
}
