import {
  AgGridReact,
  CustomCellEditorProps,
  CustomCellRendererProps,
} from 'ag-grid-react';
import { PropertyData } from './Properties';
import styles from './NumberArrayEditor.module.scss';
import { ColDef } from 'ag-grid-community';
import { useEffect, useMemo, useState } from 'react';
import SimpleDialog from './SimpleDialog';

interface NumberArrayContext {
  removeElement: (index: number) => unknown;
  addElementAfter: (index: number) => unknown;
}

export interface NumberValue {
  index: number;
  value: number;
}

export const NumberRenderer = (
  props: CustomCellRendererProps<NumberValue, number, NumberArrayContext>,
) => {
  const [value, setValue] = useState(props.value ?? 0);
  useEffect(() => {
    setValue(props.value ?? 0);
  }, [props.value]);
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        alignItems: 'stretch',
        height: '100%',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          marginRight: '6px',
        }}
      >
        [{props.data?.index}]
      </span>
      <input
        onChange={(ev) => {
          const newValue = parseFloat(ev.target.value);
          setValue(newValue);
          if (!Number.isNaN(newValue)) {
            props.setValue?.(newValue);
          }
        }}
        style={{
          flex: '1',
          minWidth: 0,
          border: 'none',
        }}
        type="number"
        value={Number.isNaN(value) ? '' : value}
      />
      <button
        className={styles['action-buttons']}
        onClick={() => {
          if (typeof props.data?.index === 'number') {
            props.context.addElementAfter(props.data.index);
          }
        }}
      >
        +
      </button>
      <button
        className={styles['action-buttons']}
        onClick={() => {
          if (typeof props.data?.index === 'number') {
            props.context.removeElement(props.data.index);
          }
        }}
      >
        -
      </button>
    </div>
  );
};

const colDefs: ColDef[] = [
  {
    field: 'value',
    rowDrag: true,
    editable: false,
    cellRenderer: NumberRenderer,
    resizable: false,
    flex: 1,
  },
];

export const NumberArrayEditor = (
  props: CustomCellEditorProps<PropertyData, number[]>,
) => {
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState(props.value ?? []);
  const numberArray: NumberValue[] = useMemo(() => {
    return value.map((value, index) => {
      return {
        index,
        value,
      };
    });
  }, [value]);

  return (
    <SimpleDialog
      title="Array Editor"
      buttons={[
        {
          label: 'Add to Start',
          action: () => {
            setValue((currentArray) => {
              const newArray = [...currentArray];
              newArray.splice(0, 0, 0);
              return newArray;
            });
          },
        },
        {
          label: 'Apply',
          action: () => {
            setIsOpen(false);
            props.onValueChange(value);
            props.stopEditing();
          },
        },
      ]}
      onClose={() => {
        setIsOpen(false);
        props.stopEditing();
      }}
      isOpen={isOpen}
    >
      <div
        style={{
          height: '200px',
          width: '230px',
          display: 'flex',
          flexDirection: 'column',
        }}
        className={styles['number-array-editor']}
      >
        <div
          style={{ flex: '1', width: '100%' }}
          className={'ag-theme-balham-dark'}
        >
          <AgGridReact<NumberValue>
            alwaysShowVerticalScroll
            context={{
              removeElement: (index: number) => {
                setValue((currentArray) => {
                  const newArray = [...currentArray];
                  newArray.splice(index, 1);
                  return newArray;
                });
              },
              addElementAfter: (index: number) => {
                setValue((currentArray) => {
                  const newArray = [...currentArray];
                  newArray.splice(index + 1, 0, 0);
                  return newArray;
                });
              },
            }}
            columnDefs={colDefs}
            rowData={numberArray}
            headerHeight={0}
            getRowId={(params) => {
              return params.data.index.toString();
            }}
            onCellValueChanged={(event) => {
              const {
                newValue,
                data: { index },
              } = event;
              setValue((currentArray) => {
                const newArray = [...currentArray];
                newArray[index] = newValue;
                return newArray;
              });
            }}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            onRowDragEnd={(event) => {
              const { overIndex, node, y, overNode } = event;
              if (
                !overNode ||
                typeof overNode.rowTop !== 'number' ||
                typeof overNode.rowHeight !== 'number'
              ) {
                return;
              }
              const isPrev = y < overNode.rowTop + overNode.rowHeight / 2;
              const isNext = y > overNode.rowTop + overNode.rowHeight / 2;
              setValue((currentArray) => {
                const newArray = [...currentArray];
                if (!node.data) {
                  return newArray;
                }
                const newIndex =
                  node.data.index < overIndex
                    ? Math.max(0, isPrev ? overIndex - 1 : overIndex)
                    : isNext
                      ? overIndex + 1
                      : overIndex;
                const element = currentArray[node.data.index];
                newArray.splice(node.data.index, 1);
                newArray.splice(newIndex, 0, element);
                return newArray;
              });
            }}
          />
        </div>
      </div>
    </SimpleDialog>
  );
};
