import { ColDef, ValueGetterParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import expandIcon from '/expand.svg';
import ExpandIcon from '@mui/icons-material/KeyboardArrowRight';
import CollapseIcon from '@mui/icons-material/KeyboardArrowDown';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useDropZone } from '@context-providers/DropZoneContext';
import { useAppSelector } from '@store/app/hooks';
import {
  makeSelectSourceTreeMetadata,
  SourceTreePreview,
  selectSourceValue,
} from '@store/selectors/sourceSelectors';
import useResizeObserver from '@react-hook/resize-observer';
import styles from './Sources.module.scss';
import { SourceMetadata } from '@store/slices/sourceSlice';
import { useSourceProvider } from '@/dashboard';

interface SourceContext {
  expand: (id: string) => unknown;
  collapse: (id: string) => unknown;
}

export interface SourceData {
  name: string;
  source: {
    key: string;
    provider: string;
  };
  type: string;
  parent: boolean;
  expanded: boolean;
  id: string;
  level: number;
  metadata?: SourceMetadata;
}

interface ExpandToggleProps {
  level: number;
  children?: ReactNode;
  expanded: boolean;
  onToggle: () => unknown;
}

const ExpandToggle = ({
  level,
  children,
  expanded,
  onToggle,
}: ExpandToggleProps) => {
  return (
    <div
      style={{
        cursor: 'pointer',
        zIndex: 100,
        paddingLeft: level * 8,
        display: 'flex',
        gap: 0,
        alignItems: 'center',
      }}
      onClick={onToggle}
    >
      {expanded ? (
        <CollapseIcon fontSize="small" />
      ) : (
        <ExpandIcon fontSize="small" />
      )}
      {children}
    </div>
  );
};

const ValueCellRenderer = (
  props: CustomCellRendererProps<SourceData, unknown>,
) => {
  const value = useAppSelector((state) =>
    selectSourceValue(
      state,
      props.data?.source.provider,
      props.data?.source.key,
    ),
  );

  return (
    <div
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        // justifyContent: "space-between",
      }}
    >
      {typeof value === 'object' && (
        <img
          style={{ cursor: 'pointer' }}
          src={expandIcon /*false ? collapseIcon : expandIcon*/}
        />
      )}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
        }}
      >
        {' '}
        {JSON.stringify(value)}
      </span>
      <span
        style={{
          color: 'lightblue',
          fontSize: '11px',
          marginLeft: '7px',
        }}
      >
        {' '}
        {props.data?.type}
      </span>
    </div>
  );
};

const NameCellRenderer = (
  props: CustomCellRendererProps<SourceData, number, SourceContext>,
) => {
  const level = props.data?.level ?? 0;
  if (!props.data?.parent) {
    return (
      <span style={{ paddingLeft: Math.max(level * 13, 5) }}>
        {props.data?.name}
      </span>
    );
  }
  return (
    <ExpandToggle
      expanded={props.data.expanded}
      level={level}
      onToggle={() => {
        if (props.data) {
          if (props.data.expanded) {
            props.context.collapse(props.data.id);
          } else {
            props.context.expand(props.data.id);
          }
        }
      }}
    >
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {props.data?.name}
      </span>
    </ExpandToggle>
  );
};

const colDefs: ColDef[] = [
  {
    field: 'name',
    cellRenderer: NameCellRenderer,
    editable: false,
    valueGetter: (params: ValueGetterParams) =>
      params.data.expanded ? '-' : '+',
    rowDrag: (params) => {
      return params.data.level >= 0;
    },
    sortable: false,
  },
  // Using dot notation to access nested property
  {
    field: 'value',
    editable: false,
    sortable: false,
    cellEditorSelector: (params) => {
      const value = params.data.value;
      if (typeof value === 'number') {
        return {
          component: 'agNumberCellEditor',
        };
      } else if (typeof value === 'string') {
        return {
          component: 'agTextCellEditor',
        };
      } else if (typeof value === 'boolean') {
        return {
          component: 'agCheckboxCellEditor',
        };
      } else {
        return {
          component: 'adsfs',
        };
      }
    },
    cellRenderer: ValueCellRenderer,
  },
  // {
  //   field: "type",
  //   sortable: false,
  // },
  // Show default header name
];

function Sources() {
  const { providers } = useSourceProvider();
  const providerNames = Object.keys(providers);
  const [selectedProvider, setSelectedProvider] = useState('NT');
  const selectSourceTreeMetadata = useMemo(makeSelectSourceTreeMetadata, []);
  const sourceTree = useAppSelector((state) =>
    selectSourceTreeMetadata(state, selectedProvider, ''),
  );

  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const { sourceGrid, setSourceGrid } = useDropZone(); // Use the context
  const containerElementRef = useRef<HTMLElement>(null);

  useResizeObserver(containerElementRef, () => {
    if (sourceGrid) {
      sourceGrid.sizeColumnsToFit();
    }
  });

  useEffect(() => {
    if (sourceGrid) {
      sourceGrid.sizeColumnsToFit();
    }
  }, [sourceGrid]);

  const [columnDefs] = useState<ColDef[]>(colDefs);

  const sourcesData = useMemo(() => {
    const data: SourceData[] = [];

    const addData = (
      name: string,
      tree: SourceTreePreview,
      parentId: string,
      level: number,
    ) => {
      const id = selectedProvider + ':' + [parentId, name].join('/');
      const parent = Object.keys(tree.children).length > 0;
      const expanded = expandedSources.includes(id);
      const sourceData: SourceData = {
        name,
        type: tree.type ?? '',
        id,
        expanded,
        parent,
        level,
        source: {
          provider: tree.provider,
          key: tree.key,
        },
        metadata: tree.metadata,
      };
      data.push(sourceData);

      if (parent && expanded) {
        Object.values(tree.childrenSources).forEach((childSource) => {
          addData(
            childSource.key.split('/').pop() ?? '',
            childSource,
            id,
            level + 1,
          );
        });
      }
    };

    providerNames.forEach((provider) => {
      data.push({
        expanded: provider === selectedProvider,
        id: provider,
        level: -1,
        name: provider,
        parent: true,
        type: '',
        source: {
          key: '',
          provider,
        },
      });
      if (provider === selectedProvider) {
        if (sourceTree) {
          Object.values(sourceTree.childrenSources).forEach((childSource) => {
            addData(childSource.key.split('/').pop() ?? '', childSource, '', 0);
          });
        }
      }
    });
    return data;
  }, [sourceTree, expandedSources, selectedProvider]);

  return (
    <div
      ref={containerElementRef as any}
      style={{ height: '100%', width: '100%' }}
      className={styles.sources}
    >
      <div style={{ height: '100%', boxSizing: 'border-box' }}>
        <div
          style={{ height: '100%', width: '100%' }}
          className={'ag-theme-balham-dark'}
        >
          <AgGridReact<SourceData>
            alwaysShowVerticalScroll
            onGridReady={(params) => {
              setSourceGrid(params.api);
            }}
            localeText={{
              noRowsToShow: 'No sources to show',
            }}
            getRowId={(props) => {
              return props.data.id;
            }}
            rowData={sourcesData}
            columnDefs={columnDefs}
            context={{
              expand: (id: string) => {
                if (providerNames.includes(id)) {
                  setSelectedProvider(id);
                } else {
                  setExpandedSources((prev) => {
                    const prevSet = new Set(prev);
                    prevSet.add(id);
                    return [...prevSet];
                  });
                }
              },
              collapse: (id: string) => {
                if (providerNames.includes(id)) {
                  setSelectedProvider('');
                } else {
                  setExpandedSources((prev) => {
                    const prevSet = new Set(prev);
                    prevSet.delete(id);
                    return [...prevSet];
                  });
                }
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Sources;
