import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import classNames from 'classnames';
import Styles from './Tab.module.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/app/hooks';
import {
  setSelectedComponent,
  addComponent,
  updateComponentPosition,
  updateComponentSize,
  removeComponent,
} from '@store/slices/layoutSlice';
import {
  makeSelectSelectedComponent,
  makeSelectTabComponents,
  selectGridGap,
  selectGridPadding,
  selectGridSize,
} from '@store/selectors/layoutSelectors';
import { useDropZone } from '@context-providers/DropZoneContext';
import { RowDropZoneParams, RowDragEndEvent } from 'ag-grid-community';
import { ComponentConfig, useComponentConfigs } from '@/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { ComponentListItem } from '../tools/ComponentPicker';
import TabComponent from './TabComponent';
import { selectEditing, setContextMenuElement } from '@store/slices/appSlice';
import { SourceData } from '../tools/editor/sources/Sources';
import { getContextMenuPosition } from './context-menu/useContextMenu';
import ContextMenu from './context-menu/ContextMenu';
import { DELETE_KEYS } from './constants';

type AddComponentToTabFunction = (
  config: ComponentConfig,
  type: string,
  event: MouseEvent,
  source?: {
    provider: string;
    key: string;
  },
) => void;

export const getComponentsWithDisplayType = (
  type: string,
  components: Record<string, ComponentConfig>,
): {
  type: string;
  config: ComponentConfig;
}[] => {
  if (!type) {
    return [];
  }
  return Object.entries(components)
    .filter(([, config]) => {
      return config.acceptedSourceTypes?.includes(type);
    })
    .map(([componentType, config]) => {
      return {
        type: componentType,
        config,
      };
    });
};

interface ComponentLayout extends Layout {
  Component: React.ComponentType<any>;
}

interface Props {
  tabId: string;
}

function Tab({ tabId }: Props) {
  const dispatch = useAppDispatch();
  const selectSelectedComponent = useMemo(makeSelectSelectedComponent, []);
  const selectTabComponents = useMemo(makeSelectTabComponents, []);
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const layoutComponents = useAppSelector((state) =>
    selectTabComponents(state, tabId),
  );
  const [components] = useComponentConfigs();
  const componentsRef = useRef(components);
  const editing = useAppSelector(selectEditing);
  const { componentGrid, sourceGrid } = useDropZone(); // Use the context
  const [gridElement, setGridElement] = useState<HTMLElement>();
  const cellSize = useAppSelector(selectGridSize);
  const cellGap = useAppSelector(selectGridGap);
  const gridPadding = useAppSelector(selectGridPadding);
  const addComponentToTabRef = useRef<AddComponentToTabFunction>();

  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  // layout is an array of objects, see the demo for more complete usage
  // const [layout, setLayout] = useState<ComponentLayout[]>([]);

  const gridLayout = useMemo(() => {
    const layout: ComponentLayout[] = Object.values(layoutComponents ?? {}).map(
      (item) => {
        return {
          Component: components[item.type].component,
          i: item.id,
          w: item.size.width,
          h: item.size.height,
          x: item.position.x,
          y: item.position.y,
          minW: item.minSize.width,
          minH: item.minSize.height,
        };
      },
    );
    return layout.map((item) => ({
      ...item,
      static: !editing,
    }));
  }, [layoutComponents, editing]);

  const minWidth = useMemo(() => {
    let maxX = 0;
    gridLayout.forEach((item) => {
      const x = (item.x + item.w) * (cellSize + cellGap);
      maxX = Math.max(x, maxX);
    });
    return maxX;
  }, [gridLayout]);

  const addComponentToTab = useCallback(
    (
      config: ComponentConfig,
      type: string,
      event: MouseEvent,
      source?: {
        provider: string;
        key: string;
      },
    ) => {
      if (!gridElement) {
        return;
      }
      const {
        dashboard: { defaultSize, minSize, children },
        defaultSource,
        properties,
      } = config;

      const { clientX, clientY } = event;
      const minWidth = Math.ceil(minSize.width / cellSize);
      const minHeight = Math.ceil(minSize.height / cellSize);
      const width = Math.max(
        minWidth,
        Math.round(defaultSize.width / cellSize),
      );
      const height = Math.max(
        minHeight,
        Math.round(defaultSize.height / cellSize),
      );
      const rect = gridElement.getBoundingClientRect();
      const x = Math.round((clientX - rect.left) / (cellSize + cellGap));
      const y = Math.round((clientY - rect.top) / (cellSize + cellGap));
      const props: Record<string, { value: unknown }> = {};
      Object.entries(properties).forEach(([name, prop]) => {
        props[name] = {
          value: prop.defaultValue,
        };
      });
      const parentId = uuidv4();
      dispatch(
        addComponent({
          tabId,
          component: {
            id: parentId,
            children: [],
            source: source ?? defaultSource,
            minSize: { width: minWidth, height: minHeight },
            size: { width, height },
            position: { x, y },
            properties: props,
            type,
            name: config.dashboard.name,
          },
        }),
      );

      if (children) {
        children.forEach((child) => {
          const component = components[child.type];
          const props: Record<string, { value: unknown }> = {};
          Object.entries(component.properties).forEach(([name, prop]) => {
            props[name] = {
              value:
                child.properties && name in child.properties
                  ? child.properties[name]
                  : prop.defaultValue,
            };
          });
          dispatch(
            addComponent({
              tabId,
              component: {
                id: uuidv4(),
                parent: parentId,
                children: [],
                minSize: { width: 0, height: 0 },
                size: { width: 0, height: 0 },
                position: { x: 0, y: 0 },
                properties: props,
                type: child.type,
                name: child.name,
              },
            }),
          );
        });
      }
    },
    [gridElement, componentGrid, sourceGrid, cellSize, cellGap],
  );

  useEffect(() => {
    addComponentToTabRef.current = addComponentToTab;
  }, [addComponentToTab]);

  useEffect(() => {
    if (componentGrid && gridElement) {
      const dropZoneParms: RowDropZoneParams = {
        getContainer() {
          return gridElement;
        },
        onDragStop({ node, event }: RowDragEndEvent<ComponentListItem>) {
          if (!node.data) {
            return;
          }
          addComponentToTabRef.current?.(
            node.data.config,
            node.data.type,
            event,
          );
        },
      };
      componentGrid.addRowDropZone(dropZoneParms);
    }
  }, [gridElement, componentGrid]);

  useEffect(() => {
    if (sourceGrid && gridElement) {
      const dropZoneParms: RowDropZoneParams = {
        getContainer() {
          return gridElement;
        },
        onDragStop({ node, event }: RowDragEndEvent<SourceData>) {
          if (!node.data) {
            return;
          }
          const componentsWithDisplayType = getComponentsWithDisplayType(
            node.data.metadata?.displayType ?? '',
            componentsRef.current,
          );

          if (componentsWithDisplayType.length > 0) {
            const [{ type, config }] = componentsWithDisplayType;
            addComponentToTabRef.current?.(
              config,
              type,
              event,
              node.data.source,
            );
          }
        },
      };
      sourceGrid.addRowDropZone(dropZoneParms);
    }
  }, [gridElement, sourceGrid]);

  return (
    <div
      onContextMenu={(event) => {
        const position = getContextMenuPosition(event);
        dispatch(
          setContextMenuElement(
            position && { position, type: 'TAB', elementId: tabId },
          ),
        );
      }}
      style={{
        cursor: 'context-menu',
        height: '100%',
        minHeight: '100%',
        minWidth,
        width: '100%',
      }}
      // Needed to capture keyboard events.
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (DELETE_KEYS.includes(e.key) && selectedComponent && editing) {
          dispatch(removeComponent({ componentId: selectedComponent.id }));
        }
      }}
    >
      <ContextMenu />
      <GridLayout
        style={{
          height: '100%',
          width: '100%',
          backgroundSize: `${cellSize + cellGap}px ${cellSize + cellGap}px`,
          backgroundImage: editing
            ? `linear-gradient(to right, rgba(10, 10, 10,.75) ${Math.max(
                cellGap,
                1,
              )}px, transparent ${Math.max(cellGap, 1)}px),
          linear-gradient(to bottom, rgba(10, 10, 10,.75) ${Math.max(
            cellGap,
            1,
          )}px, transparent ${Math.max(cellGap, 1)}px)`
            : 'none',
          backgroundPosition: `${-cellGap + gridPadding}px ${
            -cellGap + gridPadding
          }px`,
        }}
        innerRef={(el) => {
          if (el) {
            setGridElement(el);
          }
        }}
        onResizeStop={(_updatedLayout, _oldItem, newItem) => {
          const { w, h, i, x, y } = newItem;
          dispatch(
            updateComponentSize({
              id: i,
              width: w,
              height: h,
            }),
          );
          dispatch(
            updateComponentPosition({
              id: i,
              x,
              y,
            }),
          );
          // setLayout(updatedLayout as ComponentLayout[]);
        }}
        onDragStop={(_updatedLayout, _oldItem, newItem) => {
          const { x, y, i } = newItem;
          dispatch(
            updateComponentPosition({
              id: i,
              x,
              y,
            }),
          );
        }}
        className={classNames(Styles.layout, {
          [Styles.editable]: editing,
        })}
        layout={gridLayout}
        cols={20000}
        rowHeight={cellSize}
        width={(cellSize + cellGap) * 20000}
        margin={[cellGap, cellGap]}
        autoSize
        containerPadding={[gridPadding, gridPadding]}
        compactType={null}
        preventCollision
        resizeHandles={['nw', 'se']}
        onResizeStart={(_layout, _oldItem, newItem) => {
          dispatch(setSelectedComponent(newItem.i));
        }}
        onDragStart={(_layout, _oldItem, newItem) => {
          dispatch(setSelectedComponent(newItem.i));
        }}
      >
        {gridLayout.map(({ i: id, Component }) => {
          return (
            <div
              key={id}
              className={classNames(Styles.component, {
                [Styles.selected]: selectedComponent?.id === id,
              })}
              onContextMenu={(event) => {
                const position = getContextMenuPosition(event);
                dispatch(
                  setContextMenuElement(
                    position && { position, type: 'ELEMENT', elementId: id },
                  ),
                );
              }}
            >
              <TabComponent componentId={id} Component={Component} />
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}

export default Tab;
