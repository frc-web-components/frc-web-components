import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@store/app/hooks';
import {
  addComponent,
  setComponentName,
  updateComponentProperty,
  updateComponentPropertySource,
  updateComponentSource,
} from '@store/slices/layoutSlice';
import { ComponentConfig, useComponentConfigs } from '@/dashboard';
import useResizeObserver from '@react-hook/resize-observer';
import MarkdownEditor from './MarkdownEditor';
import {
  makeSelectSelectedComponent,
  makeSelectSelectedComponentChildren,
} from '@store/selectors/layoutSelectors';
import { SourceCellEditor, SourceCellRenderer } from './SourceCellRenderer';
import { ColorCellEditor, ColorCellRenderer } from './ColorCellRenderer';
import PropertyNameCellRenderer from './NameCellRenderer';
import styles from './Properties.module.scss';
import { NumberArrayEditor } from './NumberArrayEditor';
import { StringArrayEditor } from './StringArrayEditor';
import { v4 as uuidv4 } from 'uuid';
import { ParentActionsCellRenderer } from './ParentActionsCellRenderer';

export interface SourceData {
  key: string;
  provider: string;
}

export interface PropertyData {
  componentId: string;
  isParent?: boolean;
  name: string;
  source?: SourceData;
  type: string;
  defaultValue: unknown;
  componentConfig: ComponentConfig;
  tooltip?: string;
}

export interface PropertyContext {
  expanded: boolean;
  toggleExpanded: () => unknown;
  propertyValues: Record<string, unknown>;
}

const defaultColumnDefs: ColDef<PropertyData>[] = [
  {
    field: 'name',
    editable: (params) => {
      return !!params.data?.isParent;
    },
    tooltipValueGetter: (p) => p.data?.tooltip,
    sortable: false,
    cellRenderer: PropertyNameCellRenderer,
  },
  {
    field: 'source',
    sortable: false,
    cellRenderer: SourceCellRenderer,
    cellEditor: SourceCellEditor,
    editable: (params) => {
      return !!params.data?.source;
    },
    singleClickEdit: true,
  },
  // Using dot notation to access nested property
  {
    field: 'defaultValue',
    singleClickEdit: true,
    // editable: true,
    sortable: false,
    suppressKeyboardEvent: (params) => {
      if (!params.data) {
        return false;
      }
      const { type } = params.data;
      return type === 'Markdown';
    },
    valueGetter: (params) => {
      return params.data?.defaultValue;
    },
    valueFormatter: (params) => {
      if (params.data?.type) {
        const { type } = params.data;
        if (
          (type === 'Number[]' || type === 'String[]') &&
          params.value instanceof Array
        ) {
          return JSON.stringify(params.value);
        }
      }
      return params.value;
    },
    editable: (params) => {
      if (params.data?.isParent) {
        return false;
      }
      if (!params.data) {
        return true;
      }
      return true;
      // const { componentConfig, name } = params.data;
      // const { input } = componentConfig.properties[name];
      // return input?.type !== "Color";
    },
    cellEditorSelector: (params) => {
      const { type, componentConfig, name } = params.data;
      const { input } = componentConfig.properties[name];
      if (type === 'StringDropdown') {
        const { options } = input as any;
        return {
          component: 'agSelectCellEditor',
          params: {
            values:
              options instanceof Array
                ? options
                : options(params.context.propertyValues),
          },
        };
      }
      if (type === 'Color') {
        return {
          component: ColorCellEditor,
          popup: true,
        };
      }
      if (type === 'Number[]') {
        return {
          component: NumberArrayEditor,
          popup: true,
          popupPosition: 'under',
        };
      }
      if (type === 'String[]') {
        return {
          component: StringArrayEditor,
          popup: true,
          popupPosition: 'under',
        };
      }
      if (type === 'Markdown') {
        return {
          component: MarkdownEditor,
          popup: true,
        };
      }
      if (type === 'Number') {
        return {
          component: 'agNumberCellEditor',
          params: {
            min: input?.min,
            max: input?.max,
            step: input?.step,
            precision: input?.precision,
            showStepperButtons: true,
          },
        };
      } else if (type === 'String') {
        return {
          component: 'agTextCellEditor',
        };
      } else if (type === 'Boolean') {
        return {
          component: 'agCheckboxCellEditor',
        };
      } else {
        return {
          component: 'agTextCellEditor',
        };
      }
    },
    cellRendererSelector: (params) => {
      if (params.data?.isParent) {
        return {
          component: ParentActionsCellRenderer,
        };
      }
      if (!params.data) {
        return {
          component: 'agTextCellRenderer',
        };
      }
      const { type } = params.data;
      if (type === 'Color') {
        return {
          component: ColorCellRenderer,
        };
      } else if (type === 'Number') {
        return {
          component: 'agNumberCellRenderer',
        };
      } else if (type === 'String') {
        return {
          component: 'agTextCellRenderer',
        };
      } else if (type === 'Boolean') {
        return {
          component: 'agCheckboxCellRenderer',
        };
      } else {
        return {
          component: 'agTextCellRenderer',
        };
      }
    },
  },
];

interface Props {
  childComponentConfig?: ComponentConfig;
  configType?: string;
}

function Properties({ childComponentConfig, configType }: Props) {
  const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);
  const [gridApi, setGridApi] = useState<GridApi>();
  const selectSelectedComponent = useMemo(makeSelectSelectedComponent, []);
  const selectSelectedComponentChildren = useMemo(
    makeSelectSelectedComponentChildren,
    [],
  );
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const selectedComponentChildren = useAppSelector(
    selectSelectedComponentChildren,
  );
  const [components] = useComponentConfigs();
  const { displayChildren, componentConfig } = useMemo(() => {
    if (!childComponentConfig) {
      return {
        displayChildren: false,
        componentConfig: selectedComponent
          ? components[selectedComponent.type]
          : undefined,
      };
    }
    return {
      displayChildren: true,
      componentConfig: childComponentConfig,
    };
  }, [components, childComponentConfig, selectedComponent]);

  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const dispatch = useAppDispatch();
  const containerElementRef = useRef<HTMLElement>(null);
  useResizeObserver(containerElementRef, () => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  });

  const displayedComponents = useMemo(() => {
    if (!displayChildren) {
      return selectedComponent ? [selectedComponent] : [];
    }
    return (
      selectedComponentChildren?.filter((child) => child.type === configType) ??
      []
    );
  }, [
    selectedComponentChildren,
    configType,
    displayChildren,
    selectedComponent,
  ]);

  const componentPropertyValuesList = useMemo(() => {
    if (!componentConfig) {
      return {};
    }
    const list: Record<string, Record<string, unknown>> = {};
    displayedComponents.forEach((displayedComponent) => {
      const values: Record<string, unknown> = {};

      Object.entries(componentConfig.properties).forEach(([name, property]) => {
        values[name] =
          displayedComponent.properties[name]?.value ?? property.defaultValue;
      });
      list[displayedComponent.id] = values;
    });
    return list;
  }, [displayedComponents, componentConfig]);

  const rowData: PropertyData[] = useMemo(() => {
    if (!componentConfig) {
      return [];
    }
    return displayedComponents.flatMap((displayedComponent) => {
      const { id, name, source, properties } = displayedComponent;
      const parentCell: PropertyData = {
        componentId: id,
        componentConfig,
        defaultValue: isExpanded[id] !== false,
        name,
        type: '',
        source,
        isParent: true,
      };
      const propertyRows =
        isExpanded[id] === false
          ? []
          : (Object.entries(componentConfig?.properties).map(
              ([name, property]) => {
                return {
                  componentId: id,
                  name,
                  defaultValue:
                    properties[name]?.value ?? property.defaultValue,
                  type: property.input?.type ?? property.type,
                  source: properties[name].source,
                  componentConfig,
                  tooltip: property.tooltip,
                };
              },
            ) ?? []);

      return [parentCell, ...propertyRows];
    });
  }, [displayedComponents, componentConfig, isExpanded]);

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi]);

  const toggleExpanded = useCallback((componentId: string) => {
    setIsExpanded((current) => {
      const next = { ...current };
      next[componentId] = componentId in next ? !next[componentId] : false;
      return next;
    });
  }, []);

  const context: Record<string, PropertyContext> = useMemo(() => {
    const value: Record<string, PropertyContext> = {};
    displayedComponents.forEach((displayedComponent) => {
      value[displayedComponent.id] = {
        expanded: isExpanded[displayedComponent.id] ?? true,
        toggleExpanded: () => toggleExpanded(displayedComponent.id),
        propertyValues: componentPropertyValuesList[displayedComponent.id],
      };
    });
    return value;
  }, [
    isExpanded,
    componentPropertyValuesList,
    toggleExpanded,
    displayedComponents,
  ]);

  useEffect(() => {
    if (gridApi) {
      gridApi.setGridOption('context', context);
      gridApi.redrawRows();
    }
  }, [context, gridApi]);

  if (displayedComponents.length === 0 && childComponentConfig) {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
        className={styles['properties-grid']}
        key={1}
      >
        <div style={{ height: '100%', boxSizing: 'border-box' }}>
          <div
            style={{ height: '100%', width: '100%' }}
            className={'ag-theme-balham-dark'}
          >
            <button
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: 'none',
                borderRadius: 0,
                color: 'white',
                width: '100%',
                height: '100%',
                padding: 0,
                fontSize: '20px',
              }}
              onClick={() => {
                const props: Record<string, { value: unknown }> = {};
                Object.entries(childComponentConfig.properties).forEach(
                  ([name, prop]) => {
                    props[name] = {
                      value: prop.defaultValue,
                    };
                  },
                );
                dispatch(
                  addComponent({
                    tabId: '',
                    component: {
                      id: uuidv4(),
                      children: [],
                      minSize: { width: 0, height: 0 },
                      size: { width: 0, height: 0 },
                      position: { x: 0, y: 0 },
                      properties: props,
                      type: configType!,
                      name: childComponentConfig.dashboard.name,
                      parent: selectedComponent?.id,
                    },
                  }),
                );
              }}
            >
              + Add {childComponentConfig?.dashboard.name ?? ''} to{' '}
              {selectedComponent?.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerElementRef as any}
      style={{ height: '100%', width: '100%' }}
      className={styles['properties-grid']}
      key={2}
    >
      <div style={{ height: '100%', boxSizing: 'border-box' }}>
        <div
          style={{ height: '100%', width: '100%' }}
          className={'ag-theme-balham-dark'}
        >
          <AgGridReact<PropertyData>
            alwaysShowVerticalScroll
            context={context}
            onGridReady={(params) => setGridApi(params.api)}
            localeText={{
              noRowsToShow: 'No properties to show',
            }}
            rowData={rowData}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            suppressRowDrag={true}
            tooltipShowDelay={0.25}
            getRowId={(params) => {
              if (!params.data.isParent) {
                return `${params.data.componentId}-${params.data.name}`;
              }
              return `${params.data.componentId}parent`;
            }}
            animateRows={false}
            reactiveCustomComponents
            onCellValueChanged={(event) => {
              const {
                newValue,
                data: { isParent, componentId },
              } = event;
              const colId = event.column.getColId();

              if (!('name' in event.data)) {
                return;
              }
              if (colId === 'defaultValue') {
                dispatch(
                  updateComponentProperty({
                    componentId,
                    propertyName: event.data.name,
                    propertyValue: newValue,
                  }),
                );
              } else if (colId === 'source') {
                if (!isParent) {
                  dispatch(
                    updateComponentPropertySource({
                      componentId,
                      propertyName: event.data.name,
                      source: newValue,
                    }),
                  );
                } else {
                  dispatch(
                    updateComponentSource({
                      componentId,
                      source: newValue,
                    }),
                  );
                }
              } else if (colId === 'name') {
                dispatch(
                  setComponentName({
                    componentId,
                    name: newValue,
                  }),
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Properties;
