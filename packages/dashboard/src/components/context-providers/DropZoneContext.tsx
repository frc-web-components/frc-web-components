import { GridApi } from 'ag-grid-community';
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { SourceData } from '../tools/editor/sources/Sources';
import { ComponentConfig } from '@/dashboard';

// Interface for the context value
interface DropZoneContextType {
  sourceGrid?: GridApi<SourceData>;
  setSourceGrid: (grid: GridApi<SourceData>) => unknown;
  componentGrid?: GridApi<ComponentConfig>;
  setComponentGrid: (grid: GridApi<ComponentConfig>) => unknown;
}

// Create the context with a default value
const DropZoneContext = createContext<DropZoneContextType | undefined>(
  undefined,
);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
}

export const DropZoneProvider: React.FC<ProviderProps> = ({ children }) => {
  const [sourceGrid, setSourceGrid] = useState<GridApi<SourceData>>();
  const [componentGrid, setComponentGrid] =
    useState<GridApi<ComponentConfig>>();

  // The value that will be given to the context consumers
  const value = {
    sourceGrid,
    setSourceGrid,
    componentGrid,
    setComponentGrid,
  };

  return (
    <DropZoneContext.Provider value={value}>
      {children}
    </DropZoneContext.Provider>
  );
};

// Hook for consuming the context in components
export const useDropZone = (): DropZoneContextType => {
  const context = useContext(DropZoneContext);
  if (context === undefined) {
    throw new Error('useDropZone must be used within a DropZoneProvider');
  }
  return context;
};
