import { RowDropZoneParams } from 'ag-grid-community';
import { CustomCellEditorProps, CustomCellRendererProps } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropZone } from '@context-providers/DropZoneContext';
import { PropertyData, SourceData } from './Properties';
import { Tooltip } from '@mui/material';
import styles from './SourceCellRenderer.module.scss';
import RemoveCircleIcon from '@mui/icons-material/HighlightOff';
import { useAppDispatch } from '@/store/app/hooks';
import {
  updateComponentPropertySource,
  updateComponentSource,
} from '@/store/slices/layoutSlice';

export const SourceCellRenderer = (
  props: CustomCellRendererProps<PropertyData, SourceData>,
) => {
  const { sourceGrid } = useDropZone(); // Use the context
  const [element, setElement] = useState<HTMLElement>();
  const [dropZone, setDropZone] = useState<RowDropZoneParams>();

  useEffect(() => {
    if (sourceGrid && element) {
      if (dropZone) {
        sourceGrid.removeRowDropZone(dropZone);
      }
      const dropZoneParams: RowDropZoneParams = {
        getContainer() {
          return element;
        },
        onDragStop(params) {
          props.setValue?.(params.node.data.source);
        },
      };
      sourceGrid.addRowDropZone(dropZoneParams);
      setDropZone(dropZoneParams);
    }
    return () => {
      if (dropZone && sourceGrid) {
        sourceGrid.removeRowDropZone(dropZone);
      }
    };
  }, [sourceGrid, element]);

  return (
    <div
      ref={(el) => {
        if (el) {
          setElement(el);
        }
      }}
      style={{ height: '100%', display: 'flex', gap: '3px' }}
    >
      {props.value && (
        <>
          <div>{props.value.provider}:</div>
          <div>{props.value.key}</div>
        </>
      )}
    </div>
  );
};

export const SourceCellEditor = (
  props: CustomCellEditorProps<PropertyData, SourceData>,
) => {
  const { data } = props;

  const dispatch = useAppDispatch();

  const removeSource = useCallback(() => {
    if (!data) {
      return;
    }
    const { componentId, name, isParent } = data;
    if (isParent) {
      dispatch(
        updateComponentSource({
          componentId,
          source: undefined,
        }),
      );
    } else {
      dispatch(
        updateComponentPropertySource({
          componentId,
          propertyName: name,
          source: undefined,
        }),
      );
    }
  }, [data]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
      }}
    >
      <Tooltip title={'Remove source'}>
        <button
          className={styles['action-buttons']}
          style={{
            fontSize: '12px',
            lineHeight: '12px',
            cursor: 'pointer',
          }}
          onClick={() => {
            removeSource();
            props.stopEditing();
          }}
        >
          <RemoveCircleIcon fontSize="small" color="error" />
        </button>
      </Tooltip>
      <span>Remove Source</span>
    </div>
  );
};
