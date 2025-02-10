import { CustomCellEditorProps, CustomCellRendererProps } from 'ag-grid-react';
import { PropertyData } from './Properties';
import styles from './ColorCellRenderer.module.scss';
import { useState } from 'react';
import SimpleDialog from './SimpleDialog';
import Chrome from '@uiw/react-color-chrome';

export const ColorCellRenderer = (
  props: CustomCellRendererProps<PropertyData>,
) => {
  return (
    <div className={styles['color-cell']}>
      <div
        style={{
          backgroundColor: props.value,
        }}
      ></div>
    </div>
  );
};

export const ColorCellEditor = (
  props: CustomCellEditorProps<PropertyData, string>,
) => {
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState(props.value || '#000');

  return (
    <div>
      <SimpleDialog
        title="Color Picker"
        buttons={[
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
        <div data-color-mode="dark">
          <Chrome
            className={styles['color-editor']}
            color={value}
            placement={'' as any}
            onChange={(color) => {
              setValue(color.hexa);
            }}
          />
        </div>
      </SimpleDialog>
    </div>
  );
};
