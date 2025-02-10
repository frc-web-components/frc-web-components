import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ColDef } from 'ag-grid-community';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { Plugin, useDashboard } from '@/dashboard';
import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface PluginGridContext {
  onRemove: (location: string) => void;
}

export const ActionCellRenderer = (
  props: CustomCellRendererProps<Plugin, any, PluginGridContext>,
) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconButton
        aria-label="remove"
        disabled={!props.data?.location}
        onClick={() => {
          props.context.onRemove(props.data!.location);
        }}
        size="small"
        color="error"
        sx={{ width: '100%', height: '100%' }}
        style={{
          outline: 'none',
          paddingBottom: 0,
          paddingTop: '3px',
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const columnDefs: ColDef[] = [
  {
    tooltipValueGetter(params) {
      return `Remove plugin "${params.data.name}"`;
    },
    cellRenderer: ActionCellRenderer,
    width: 50,
  },
  {
    field: 'name',
    tooltipValueGetter(params) {
      return params.data.description;
    },
    sortable: true,
  },
  {
    field: 'version',
    tooltipValueGetter(params) {
      return params.data.description;
    },
  },
  {
    field: 'location',
    tooltipValueGetter(params) {
      return params.data.location;
    },
  },
];

export default function PluginsDialog({ open, onClose }: Props) {
  const dashboard = useDashboard();
  const [loadedPlugins, setLoadedPlugins] = useState<Plugin[]>(
    dashboard.getLoadedPlugins(),
  );

  useEffect(() => {
    dashboard.on('setLoadedPluginsEvent', (plugins) => {
      setLoadedPlugins(plugins);
    });
  }, [dashboard]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Loaded Plugins</DialogTitle>
      <DialogContent>
        <div style={{ height: '300px', width: '500px' }}>
          <div style={{ height: '100%', boxSizing: 'border-box' }}>
            <div
              style={{ height: '100%', width: '100%' }}
              className={'ag-theme-balham-dark'}
            >
              <AgGridReact<Plugin>
                alwaysShowVerticalScroll
                context={{
                  onRemove: (location: string) => {
                    dashboard.emit('pluginDialogRemoveEvent', location);
                  },
                }}
                localeText={{
                  noRowsToShow: 'No plugins loaded',
                }}
                rowData={loadedPlugins}
                columnDefs={columnDefs}
                rowDragManaged={true}
                suppressMoveWhenRowDragging={true}
                onGridReady={(event) => event.api.sizeColumnsToFit()}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => {
            dashboard.emit('pluginDialogLoadPluginEvent');
          }}
          autoFocus
        >
          Load Plugin
        </Button>
      </DialogActions>
    </Dialog>
  );
}
