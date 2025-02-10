import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '@store/app/hooks';
import {
  selectContextMenuElement,
  setContextMenuElement,
} from '@store/slices/appSlice';
import ElementMenu from './ElementMenu';
import { clearTab } from '@store/slices/layoutSlice';

export default function ContextMenu() {
  const contextMenuElement = useAppSelector(selectContextMenuElement);
  const dispatch = useAppDispatch();

  const onClose = () => dispatch(setContextMenuElement(undefined));
  const position = contextMenuElement?.position ?? { left: 0, top: 0 };

  const onClear = () => {
    onClose();
    if (contextMenuElement?.elementId) {
      dispatch(clearTab({ tabId: contextMenuElement.elementId }));
    }
  };

  return (
    <Menu
      open={!!contextMenuElement}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position}
    >
      {contextMenuElement?.type === 'ELEMENT' && (
        <ElementMenu
          onClose={onClose}
          open={!!contextMenuElement}
          componentId={contextMenuElement.elementId!}
        />
      )}
      {contextMenuElement?.type === 'TAB' && [
        <MenuItem onClick={onClear}>Clear Layout</MenuItem>,
      ]}
    </Menu>
  );
}
