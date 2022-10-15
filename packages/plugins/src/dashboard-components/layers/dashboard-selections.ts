import { WebbitConnector } from '@webbitjs/webbit';

export default class DashboardSelections {
  #eventListeners: Map<HTMLElement, (event: Event) => unknown> = new Map();
  #listen = true;
  constructor(
    connector: WebbitConnector,
    onSelection: (element: HTMLElement) => void
  ) {
    connector.subscribeElementConnected((value: any) => {
      const element = value.element as HTMLElement;
      const listener = (ev: Event) => {
        if (this.#listen) {
          ev.stopPropagation();
          onSelection(element);
        }
      };
      element.addEventListener('mouseup', listener);
      element.addEventListener('click', listener);
      this.#eventListeners.set(element, listener);
    });

    connector.subscribeElementDisconnected((value: any) => {
      const element = value.element as HTMLElement;
      const mouseUpListener = this.#eventListeners.get(element);
      if (mouseUpListener) {
        element.removeEventListener('mouseup', mouseUpListener);
      }
      const clickListener = this.#eventListeners.get(element);
      if (clickListener) {
        element.removeEventListener('click', clickListener);
      }
      this.#eventListeners.delete(element);
    });
  }

  setListening(listen: boolean): void {
    this.#listen = listen;
  }
}
