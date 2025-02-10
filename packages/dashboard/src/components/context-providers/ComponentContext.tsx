import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { SourceInfo, useSourceProvider } from '@/dashboard';
import { useAppSelector } from '@store/app/hooks';
import { selectComponent } from '@store/selectors/layoutSelectors';
import { SourceTree, useSourceTree } from '@store/selectors/sourceSelectors';
import { Component } from '@store/slices/layoutSlice';

// Interface for the context value
interface ComponentContextType {
  propertySources?: Record<string, SourceInfo>;
  component: Component;
  setSourceValue: (value: unknown, sourceInfo: SourceInfo) => unknown;
}

// Create the context with a default value
const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined,
);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
  propertySources?: Record<string, SourceInfo>;
  componentId: string;
}

export const ComponentProvider: React.FC<ProviderProps> = ({
  children,
  propertySources,
  componentId,
}) => {
  const component = useAppSelector((state) =>
    selectComponent(state, componentId),
  );
  const { setSourceValue } = useSourceProvider();

  // The value that will be given to the context consumers
  const value = {
    propertySources,
    component: component!,
    setSourceValue,
  };

  return (
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  );
};

// Hook for consuming the context in components
export const useComponent = (): ComponentContextType => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error('useComponent must be used within a ComponentProvider');
  }
  return context;
};

export const useParentSourceTree = (): SourceTree | undefined => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error('useComponent must be used within a ComponentProvider');
  }
  const { component } = context;
  return useSourceTree(component?.source?.provider, component?.source?.key);
};

function treeToJson(tree: SourceTree): Record<string, unknown> | unknown {
  if (Object.keys(tree.childrenSources).length === 0) {
    return tree.value;
  }

  const json: Record<string, unknown> = {};
  Object.values(tree.childrenSources).forEach((child) => {
    json[child.name] = treeToJson(child);
  });
}

export const useParentSourceJson = ():
  | Record<string, unknown>
  | undefined
  | unknown => {
  const sourceTree = useParentSourceTree();

  return useMemo(() => {
    if (!sourceTree) {
      return undefined;
    }
    return treeToJson(sourceTree);
  }, [sourceTree]);
};
