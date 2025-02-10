import { useCallback, useState } from 'react';
import { store } from '@store/app/store';
import { selectContextMenuElement } from '@store/slices/appSlice';

export function getContextMenuPosition(event: React.MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  const contextMenuElement = selectContextMenuElement(store.getState());
  return !contextMenuElement
    ? {
        left: event.clientX + 2,
        top: event.clientY - 6,
      }
    : undefined;
}

export default function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu((menu) => {
      return menu === null
        ? {
            x: event.clientX + 2,
            y: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null;
    });
  }, []);

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    handleContextMenu,
    handleClose,
  };
}
