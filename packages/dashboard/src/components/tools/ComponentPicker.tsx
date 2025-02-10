import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';
import { useDropZone } from '@context-providers/DropZoneContext';
import { ComponentConfig, useComponentConfigs } from '@/dashboard';

export interface ComponentListItem {
  config: ComponentConfig;
  type: string;
}

const defaultColumnDefs: ColDef[] = [
  {
    field: 'config.dashboard.name',
    headerName: 'Name',
    editable: false,
    sortable: true,
    rowDrag: true,
  },
  {
    field: 'config.dashboard.description',
    headerName: 'Description',
    sortable: false,
  },
];

function ComponentPicker() {
  const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);
  const [components] = useComponentConfigs();
  const { setComponentGrid } = useDropZone();

  const rowData = useMemo(() => {
    return Object.entries(components)
      .map(([type, component]) => ({
        config: component,
        type,
      }))
      .filter(
        ({
          config: {
            dashboard: { topLevel },
          },
        }) => {
          return topLevel !== false;
        },
      );
  }, [components]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', boxSizing: 'border-box' }}>
        <div
          style={{ height: '100%', width: '100%' }}
          className={'ag-theme-balham-dark'}
        >
          <AgGridReact<ComponentListItem>
            alwaysShowVerticalScroll
            onGridReady={(params) => setComponentGrid(params.api as any)}
            rowData={Object.values(rowData).sort((a, b) =>
              a.config.dashboard.name.localeCompare(b.config.dashboard.name),
            )}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            getRowId={(params) => {
              return params.data.config.dashboard.name;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ComponentPicker;
