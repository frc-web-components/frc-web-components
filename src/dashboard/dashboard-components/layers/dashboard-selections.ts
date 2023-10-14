import { WebbitConnector } from '@webbitjs/webbit';

export default class DashboardSelections {
  #eventListeners: Map<
    HTMLElement,
    {
      onSelect: (event: Event) => unknown;
      onContextMenu: (event: Event) => unknown;
    }
  > = new Map();
  #listen = true;
  constructor(
    connector: WebbitConnector,
    onSelection: (element: HTMLElement) => void,
    onContextMenuOpen: (ev: Event, element: HTMLElement) => void
  ) {
    connector.subscribeElementConnected((value: any) => {
      const element = value.element as HTMLElement;
      const onSelect = (ev: Event) => {
        if (this.#listen) {
          ev.stopPropagation();
          onSelection(element);
        }
      };
      const onContextMenu = (ev: Event) => {
        if (this.#listen) {
          ev.stopPropagation();
          ev.preventDefault();
          onContextMenuOpen(ev, element);
        }
      };
      element.addEventListener('mouseup', onSelect);
      element.addEventListener('click', onSelect);
      element.addEventListener('contextmenu', onContextMenu);
      this.#eventListeners.set(element, {
        onSelect,
        onContextMenu,
      });
    });

    connector.subscribeElementDisconnected((value: any) => {
      const element = value.element as HTMLElement;
      const listeners = this.#eventListeners.get(element);
      if (listeners) {
        element.removeEventListener('mouseup', listeners.onSelect);
        element.removeEventListener('click', listeners.onSelect);
        element.removeEventListener('contextmenu', listeners.onContextMenu);
      }
      this.#eventListeners.delete(element);
    });
  }

  setListening(listen: boolean): void {
    this.#listen = listen;
  }
}
