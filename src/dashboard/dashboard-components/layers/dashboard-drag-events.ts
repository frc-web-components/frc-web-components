import { WebbitConnector } from '@webbitjs/webbit';

type DragListener = (event: DragEvent) => unknown;

export default class DashboardDragEvents {
  #connector: WebbitConnector;
  #elements: Set<HTMLElement> = new Set();
  #eventListeners: Map<
    HTMLElement,
    { dragover: DragListener; dragleave: DragListener }
  > = new Map();
  #onDragover: (
    element: HTMLElement,
    position: { x: number; y: number }
  ) => void;
  #onDragleave: (element: HTMLElement) => void;

  constructor(
    connector: WebbitConnector,
    onDragover: (
      element: HTMLElement,
      position: { x: number; y: number }
    ) => void,
    onDragleave: (element: HTMLElement) => void
  ) {
    this.#connector = connector;
    this.#onDragover = onDragover;
    this.#onDragleave = onDragleave;
    connector.subscribeElementConnected((value: any) => {
      const element = value.element as HTMLElement;
      this.#elements.add(element);
    });

    connector.subscribeElementDisconnected((value: any) => {
      const element = value.element as HTMLElement;
      this.#elements.delete(element);
    });
  }

  setDraggedElement(): void {
    const droppableElements: { slot: string; selector: string }[] = [
      { slot: '', selector: 'dashboard-tab' },
    ];
    this.#addEvents(droppableElements);
  }

  #addEvents(droppableSelectors: { slot: string; selector: string }[]): void {
    const selectors = droppableSelectors.map(({ selector }) => selector);
    const droppableElements: HTMLElement[] = [];
    this.#elements.forEach((element) => {
      const elementSelector =
        this.#connector.getMatchingElementSelector(element);
      const hasMatchingSelector = selectors.some(
        (selector) => elementSelector === selector
      );
      if (hasMatchingSelector) {
        droppableElements.push(element);
      }
    });

    droppableElements.forEach((element) => {
      const dragoverListener = (ev: DragEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.#onDragover(element, { x: ev.offsetX, y: ev.offsetY });
      };
      const dragleaveListener = () => {
        this.#onDragleave(element);
      };
      element.addEventListener('dragover', dragoverListener);
      element.addEventListener('drop', dragoverListener);
      element.addEventListener('dragleave', dragleaveListener);
      this.#eventListeners.set(element, {
        dragover: dragoverListener,
        dragleave: dragleaveListener,
      });
    });
  }

  endDrag(): void {
    this.#eventListeners.forEach(({ dragover, dragleave }, element) => {
      element.removeEventListener('dragover', dragover);
      element.removeEventListener('drop', dragover);
      element.removeEventListener('dragleave', dragleave);
    });
    this.#eventListeners = new Map();
  }
}
