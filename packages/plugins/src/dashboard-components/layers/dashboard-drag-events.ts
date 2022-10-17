import { WebbitConnector } from '@webbitjs/webbit';
import { getAllowedChildrenByConfig } from '@frc-web-components/dashboard';

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

    // connector.subscribeElementDisconnected((value: any) => {
    //   const element = value.element as HTMLElement;
    //   const dragoverListener = this.#eventListeners.get(element);
    //   if (dragoverListener) {
    //     element.removeEventListener('dragover', dragoverListener);
    //   }
    //   const dropListener = this.#eventListeners.get(element);
    //   if (dropListener) {
    //     element.removeEventListener('drop', dropListener);
    //   }
    //   this.#eventListeners.delete(element);
    // });
  }

  setDraggedElement(elementSelector: string): void {
    const droppableElements: { slot: string; selector: string }[] = [];
    const selectors = this.#connector.getElementConfigSelectors();
    selectors.forEach((selector) => {
      const config = this.#connector.getElementConfig(selector);
      if (config) {
        const allowedChildren = getAllowedChildrenByConfig(
          config,
          this.#connector
        );
        const draggedElementAllowed = allowedChildren.find(
          ({ allowedChildren: allowed }) => allowed.includes(elementSelector)
        );
        if (draggedElementAllowed) {
          droppableElements.push({
            slot: draggedElementAllowed.slot,
            selector,
          });
        }
      }
    });
    this.#addEvents(droppableElements);
  }

  #addEvents(droppableSelectors: { slot: string; selector: string }[]): void {
    // this.#droppableSelectors = droppableSelectors;
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
