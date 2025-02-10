import { RootState, store } from '../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { Source, SourceMetadata } from '../slices/sourceSlice';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';

export const selectSources = (state: RootState) => state.source.sources;

export const selectProviderSources = (state: RootState, provider?: string) =>
  typeof provider === 'undefined' ? undefined : state.source.sources[provider];

export const selectProviderMetadata = (state: RootState, provider?: string) =>
  typeof provider === 'undefined' ? undefined : state.source.metadata[provider];

export const selectSourceUpdate = (
  state: RootState,
  provider?: string,
  key?: string,
) => {
  if (typeof provider === 'undefined' || typeof key === 'undefined') {
    return undefined;
  }
  return state.source.sourceUpdates?.[provider]?.[key];
};

export const selectConnectionStatus = (state: RootState) =>
  state.source.connectionStatus;

export const selectSourceMetadata = (
  state: RootState,
  provider?: string,
  key?: string,
) =>
  typeof provider === 'undefined' || typeof key === 'undefined'
    ? undefined
    : state.source.metadata[provider]?.[key];

export const selectProviderSourceValues = (
  state: RootState,
  provider?: string,
) =>
  typeof provider === 'undefined'
    ? undefined
    : state.source.sourceValues[provider];

export const selectSource = (
  state: RootState,
  provider?: string,
  key?: string,
) =>
  typeof provider === 'undefined' || typeof key === 'undefined'
    ? undefined
    : state.source.sources[provider]?.[key];

export const selectSourceValue = (
  state: RootState,
  provider?: string,
  key?: string,
) =>
  typeof provider === 'undefined' || typeof key === 'undefined'
    ? undefined
    : state.source.sourceValues[provider]?.[key];

export interface SourceTree extends Source {
  value: unknown;
  childrenSources: Record<string, SourceTree>;
}

export interface SourceTreePreview extends Source {
  childrenSources: Record<string, SourceTreePreview>;
  metadata?: SourceMetadata;
}

const selectSourceTree = makeSelectSourceTree();

export function useSourceTree(provider?: string, key?: string) {
  const update = useAppSelector((state) =>
    selectSourceUpdate(state, provider, key),
  );
  const [tree, setTree] = useState<SourceTree>();

  useEffect(() => {
    setTree(selectSourceTree(store.getState(), provider, key));
  }, [update, provider, key]);

  return tree;
}

export function makeSelectSourceTree() {
  return createSelector(
    [selectProviderSources, selectProviderSourceValues, selectSource],
    (sources, sourceValues, source) => {
      if (!sources || !source) {
        return undefined;
      }

      const getTree = (sourceKey: string): SourceTree => {
        const source = sources[sourceKey];
        const value = sourceValues?.[sourceKey];
        const childrenSources: Record<string, SourceTree> = {};
        source.children.forEach((key) => {
          const childSource = sources[key];
          childrenSources[childSource.name] = getTree(key);
        });
        return {
          ...source,
          value,
          childrenSources,
        };
      };

      return getTree(source.key);
    },
  );
}

export function makeSelectSourceTreeMetadata() {
  return createSelector(
    [selectProviderSources, selectSource, selectProviderMetadata],
    (sources, source, metadata) => {
      if (!sources || !source) {
        return undefined;
      }

      const getTree = (sourceKey: string): SourceTreePreview => {
        const source = sources[sourceKey];
        const childrenSources: Record<string, SourceTreePreview> = {};
        source.children.forEach((key) => {
          const childSource = sources[key];
          childrenSources[childSource.name] = getTree(key);
        });
        return {
          ...source,
          metadata: metadata?.[sourceKey],
          childrenSources,
        };
      };

      return getTree(source.key);
    },
  );
}
