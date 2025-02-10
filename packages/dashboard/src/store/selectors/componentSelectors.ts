import camelCase from 'lodash.camelcase';
import { memoizeWithArgs } from 'proxy-memoize';
import { RootState, store } from '../app/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Source } from '../slices/sourceSlice';
import { Component } from '../slices/layoutSlice';
import { useComponentConfigs, SourceInfo } from '@/dashboard';

export function useComponentPropertyValues(componentId: string) {
  const prevComponent = useRef<Component>();
  const prevSources = useRef<Record<string, Source | undefined>>({});
  const prevValues = useRef<Record<string, unknown>>({});
  const prevParentSource = useRef<Source>();
  const prevParentValue = useRef<unknown>();
  const prevMatchingSources = useRef<Record<string, Source | undefined>>({});
  const prevMatchingSourceValues = useRef<Record<string, unknown>>({});
  const [components] = useComponentConfigs();

  const [propValues, setPropValues] = useState<
    Record<
      string,
      {
        value: unknown;
        sourceInfo: SourceInfo;
      }
    >
  >({});

  const checkIfChanged = useCallback(() => {
    const sourceState = store.getState().source;
    const layoutState = store.getState().layout;

    const component = layoutState.components[componentId];
    let hasChanged = false;

    if (component !== prevComponent.current) {
      hasChanged = true;
    }

    const sources = sourceState.sources;
    const sourceValues = sourceState.sourceValues;

    const nextParentSource = component?.source
      ? sources[component.source.provider]?.[component.source.key]
      : undefined;
    const nextParentSourceValue = component?.source
      ? sourceValues[component.source.provider]?.[component.source.key]
      : undefined;

    if (
      nextParentSource !== prevParentSource.current ||
      nextParentSourceValue !== prevParentValue.current
    ) {
      hasChanged = true;
    }

    const nextSources: Record<string, Source | undefined> = {};
    const nextValues: Record<string, unknown> = {};

    const nextMatchingSources: Record<string, Source | undefined> = {};
    const nextMatchingSourceValues: Record<string, unknown> = {};

    for (const [name, property] of Object.entries(
      component?.properties ?? {},
    )) {
      const propertySource = property.source
        ? sources[property.source.provider]?.[property.source.key]
        : undefined;
      const value = propertySource
        ? sourceValues[propertySource.provider][propertySource.key]
        : undefined;

      nextSources[name] = propertySource;
      nextValues[name] = value;

      if (nextParentSource && nextParentSource.children.length > 0) {
        const matchingSource = nextParentSource.children
          .map((sourceId) => sources[nextParentSource.provider][sourceId])
          .find((source) => {
            return name === camelCase(source.name);
          });
        const matchSourceValue = matchingSource
          ? sourceValues[matchingSource.provider][matchingSource.key]
          : undefined;

        nextMatchingSources[name] = matchingSource;
        nextMatchingSourceValues[name] = matchSourceValue;
      }

      if (
        nextMatchingSources[name] !== prevMatchingSources.current[name] ||
        nextMatchingSourceValues[name] !==
          prevMatchingSourceValues.current[name]
      ) {
        hasChanged = true;
      }

      if (
        prevSources.current[name] !== propertySource ||
        prevValues.current[name] !== value
      ) {
        hasChanged = true;
      }

      if (hasChanged) {
        prevComponent.current = component;
        prevParentSource.current = nextParentSource;
        prevParentValue.current = nextParentSourceValue;
        prevSources.current = nextSources;
        prevValues.current = nextValues;
        prevMatchingSources.current = nextMatchingSources;
        prevMatchingSourceValues.current = nextMatchingSourceValues;
      }
    }
    return hasChanged;
  }, [componentId]);

  const updateRefs = useCallback(() => {
    const sourceState = store.getState().source;
    const sources = sourceState.sources;
    const sourceValues = sourceState.sourceValues;
    const componentConfig = prevComponent.current
      ? components[prevComponent.current.type]
      : undefined;

    const propertyValues: Record<
      string,
      {
        value: unknown;
        sourceInfo: SourceInfo;
      }
    > = {};
    const parentSource = prevParentSource.current;
    Object.entries(prevComponent.current?.properties ?? {}).forEach(
      ([name, property]) => {
        const defaultValue = property.value;
        const propertySource = prevSources.current[name];
        const value = prevValues.current[name];
        if (propertySource) {
          propertyValues[name] = {
            value,
            sourceInfo: {
              type: 'source',
              source: {
                key: property.source!.key,
                provider: property.source!.provider,
              },
            },
          };
        } else if (parentSource) {
          const isPrimaryProp = componentConfig?.primaryProperty === name;
          if (parentSource.children.length > 0) {
            const matchingSource = parentSource.children
              .map((sourceId) => sources[parentSource.provider][sourceId])
              .find((source) => {
                return name === camelCase(source.name);
              });
            if (matchingSource) {
              const value =
                sourceValues[matchingSource.provider][matchingSource.key];
              propertyValues[name] = {
                value,
                sourceInfo: {
                  type: 'source',
                  source: {
                    provider: matchingSource.provider,
                    key: matchingSource.key,
                  },
                },
              };
            } else {
              propertyValues[name] = {
                value: defaultValue,
                sourceInfo: {
                  type: 'defaultValue',
                },
              };
            }
          } else if (
            parentSource.propertyType === 'Object' &&
            name in (prevParentValue.current as any)
          ) {
            propertyValues[name] = {
              value: (prevParentValue.current as any)[name],
              sourceInfo: {
                type: 'sourceProperty',
                source: {
                  provider: parentSource.provider,
                  key: parentSource.key,
                  property: name,
                },
              },
            };
          } else if (isPrimaryProp) {
            const value = sourceValues[parentSource.provider][parentSource.key];
            propertyValues[name] = {
              value,
              sourceInfo: {
                type: 'source',
                source: {
                  provider: parentSource.provider,
                  key: parentSource.key,
                },
              },
            };
          } else {
            propertyValues[name] = {
              value:
                'temporaryValue' in property
                  ? property.temporaryValue
                  : defaultValue,
              sourceInfo: {
                type: 'defaultValue',
              },
            };
          }
        } else {
          propertyValues[name] = {
            value:
              'temporaryValue' in property
                ? property.temporaryValue
                : defaultValue,
            sourceInfo: {
              type: 'defaultValue',
            },
          };
        }
      },
    );
    setPropValues(propertyValues);
  }, [componentId]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (!checkIfChanged()) {
        return;
      }
      updateRefs();
    });
    checkIfChanged();
    updateRefs();
    return unsubscribe;
  }, [componentId]);

  return propValues;
}

export function makeSelectComponentPropertyValues() {
  return memoizeWithArgs((state: RootState, componentId: string) => {
    const component = state.layout.components[componentId];
    const sources = state.source.sources;
    const sourceValues = state.source.sourceValues;
    if (!component) {
      return undefined;
    }
    const parentSource = component.source
      ? sources[component.source.provider]?.[component.source.key]
      : undefined;
    const parentSourceValue = component.source
      ? sourceValues[component.source.provider]?.[component.source.key]
      : undefined;
    const propertyValues: Record<
      string,
      {
        value: unknown;
        sourceInfo: SourceInfo;
      }
    > = {};
    Object.entries(component.properties).forEach(([name, property]) => {
      const defaultValue = property.value;
      const propertySource = property.source
        ? sources[property.source.provider]?.[property.source.key]
        : undefined;
      const value = propertySource
        ? sourceValues[propertySource.provider][propertySource.key]
        : undefined;
      if (propertySource) {
        propertyValues[name] = {
          value,
          sourceInfo: {
            type: 'source',
            source: {
              key: property.source!.key,
              provider: property.source!.provider,
            },
          },
        };
      } else if (parentSource) {
        if (parentSource.children.length > 0) {
          const matchingSource = parentSource.children
            .map((sourceId) => sources[parentSource.provider][sourceId])
            .find((source) => {
              return name === camelCase(source.name);
            });
          if (matchingSource) {
            const value =
              sourceValues[matchingSource.provider][matchingSource.key];
            propertyValues[name] = {
              value,
              sourceInfo: {
                type: 'source',
                source: {
                  provider: matchingSource.provider,
                  key: matchingSource.key,
                },
              },
            };
          } else {
            propertyValues[name] = {
              value: defaultValue,
              sourceInfo: {
                type: 'defaultValue',
              },
            };
          }
        } else if (
          parentSource.propertyType === 'Object' &&
          name in (parentSourceValue as any)
        ) {
          propertyValues[name] = {
            value: (parentSourceValue as any)[name],
            sourceInfo: {
              type: 'sourceProperty',
              source: {
                provider: parentSource.provider,
                key: parentSource.key,
                property: name,
              },
            },
          };
        } else {
          propertyValues[name] = {
            value:
              'temporaryValue' in property
                ? property.temporaryValue
                : defaultValue,
            sourceInfo: {
              type: 'defaultValue',
            },
          };
        }
      } else {
        propertyValues[name] = {
          value:
            'temporaryValue' in property
              ? property.temporaryValue
              : defaultValue,
          sourceInfo: {
            type: 'defaultValue',
          },
        };
      }
    });
    return propertyValues;
  });
}
