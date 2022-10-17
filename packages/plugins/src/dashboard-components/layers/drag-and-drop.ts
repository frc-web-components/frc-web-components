import {
  FrcDashboard,
  appendElementToDashboard,
} from '@frc-web-components/dashboard';
import DashboardDragEvents from './dashboard-drag-events';

interface DragElement {
  selector: string;
  dragPosition?: { x: number; y: number };
  dragParent?: HTMLElement;
}

export function addDragAndDrop(dashboard: FrcDashboard): void {
  dashboard.addLayer('dragAndDrop');

  let dragElement: DragElement | undefined;

  const onDragover = (
    element: HTMLElement,
    position: { x: number; y: number }
  ) => {
    if (dragElement) {
      dragElement.dragParent = element;
      dragElement.dragPosition = position;
    }
  };

  const onDragleave = (element: HTMLElement) => {
    // This is called right before the dragend event. We wait a bit otherwise
    // dragParent and dragPosition will always be undefined
    setTimeout(() => {
      if (dragElement?.dragParent === element) {
        dragElement.dragParent = undefined;
        dragElement.dragPosition = undefined;
      }
    }, 50);
  };

  const dragEvents = new DashboardDragEvents(
    dashboard.getConnector(),
    onDragover,
    onDragleave
  );

  dashboard.subscribe('dragNewElementStart', (value: any) => {
    const selector = value.selector as string;
    dragElement = { selector };
    dragEvents.setDraggedElement(selector);
  });

  dashboard.subscribe('dragNewElementEnd', () => {
    if (dragElement?.dragParent) {
      const elements = appendElementToDashboard(
        dashboard.getConnector(),
        dragElement.selector,
        dragElement.dragParent
      );
      if (dragElement.dragPosition) {
        const { x, y } = dragElement.dragPosition;
        elements.forEach((element) => {
          // eslint-disable-next-line no-param-reassign
          element.style.transform = `translate(${x}px, ${y}px)`;
        });
      }
    }
    dragElement = undefined;
    dragEvents.endDrag();
  });
}
