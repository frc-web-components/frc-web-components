import {
  addInteractions,
  FrcDashboard,
  getElementBoundingBox,
  removeInteractions,
} from '@frc-web-components/dashboard';
import interact from 'interactjs';
import DashboardSelections from './dashboard-selections';
import getTranslationFromStyles from './getTranslationFromStyles';

function round(val: number, gridSize: number): number {
  return Math.floor(val / gridSize + 0.5) * gridSize;
}

function createSelectionBox(): HTMLElement {
  const box = document.createElement('div');
  box.style.border = '2px dashed green';
  box.style.boxSizing = 'border-box';
  box.style.display = 'none';
  box.style.position = 'absolute';
  box.style.pointerEvents = 'all';
  return box;
}

class AbsolutePositioningLayout {
  private dashboard: FrcDashboard;
  private element: HTMLElement;
  private selectionBox = createSelectionBox();
  private interactive = interact(this.selectionBox);

  private snappingEnabled = false;
  private gridSize = 40.0;

  constructor(dashboard: FrcDashboard, layerElement: HTMLElement) {
    this.dashboard = dashboard;
    this.element = layerElement;
    // eslint-disable-next-line no-new
    new DashboardSelections(this.dashboard.getConnector(), (element) => {
      if (this.dashboard.isElementEditable()) {
        this.dashboard.setSelectedElement(element);
      }
    });

    this.dashboard.subscribe('elementSelect', () => {
      if (this.#selectedElement) {
        this.#addResizeInteraction();
        this.#addDragInteraction();
      }
    });

    this.dashboard.subscribe('dragNewElementStart', () => {
      removeInteractions(this.selectionBox);
    });

    this.dashboard.subscribe('dragNewElementEnd', () => {
      addInteractions(this.selectionBox);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') {
        this.selectionBox.style.border = '2px solid blue';
        this.snappingEnabled = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control') {
        this.selectionBox.style.border = '2px dashed green';
        this.snappingEnabled = false;
      }
    });

    this.element.appendChild(this.selectionBox);
    this.interactive = interact(this.selectionBox);

    this.interactive.on('resizeend', () => {
      this.#addResizeInteraction();
    });

    this.interactive.on('dragend', () => {
      this.#addDragInteraction();
    });
    this.#setBounds();
    this.#addDragInteraction();
  }

  #setBounds(): void {
    const selectedElement = this.dashboard.getSelectedElement();
    if (
      this.dashboard.isDrawerOpened() &&
      selectedElement &&
      selectedElement.tagName.toLowerCase() !== 'dashboard-tab'
    ) {
      const { left, top, width, height } = getElementBoundingBox(
        this.element,
        selectedElement
      );
      this.selectionBox.style.left = `${left}px`;
      this.selectionBox.style.top = `${top}px`;
      this.selectionBox.style.width = `${width}px`;
      this.selectionBox.style.height = `${height}px`;
      this.selectionBox.style.display = 'block';
    } else {
      this.selectionBox.style.display = 'none';
    }

    window.requestAnimationFrame(() => {
      this.#setBounds();
    });
  }

  #getLayout() {
    if (!this.#selectedElement) {
      return undefined;
    }
    return this.dashboard
      .getConnector()
      .getMatchingElementConfig(this.#selectedElement)?.dashboard?.layout;
  }

  get #selectedElement(): HTMLElement | null {
    return this.dashboard.getSelectedElement();
  }

  get #translation() {
    if (!this.#selectedElement) {
      return { x: 0, y: 0, z: 0 };
    }
    return getTranslationFromStyles(this.#selectedElement);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get #layoutConfig() {
    const layout = this.#getLayout();
    return {
      type: layout?.type,
      resizableVertical: layout?.resizable?.vertical ?? true,
      resizableHorizontal: layout?.resizable?.horizontal ?? true,
      movable: layout?.movable ?? true,
      minWidth: layout?.size?.minWidth ?? 20,
      minHeight: layout?.size?.minHeight ?? 20,
    };
  }

  #addResizeInteraction(): void {
    const { resizableHorizontal, resizableVertical, minWidth, minHeight } =
      this.#layoutConfig;

    if (!this.#selectedElement) {
      return;
    }
    const { width, height } = this.#selectedElement.getBoundingClientRect();
    const selectionRect = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
    const { gridSize } = this;

    this.interactive.resizable({
      // // resize from all edges and corners
      edges: {
        left: resizableHorizontal && width > 60,
        right: resizableHorizontal,
        top: resizableVertical && height > 60,
        bottom: resizableVertical,
      },
      listeners: {
        start: (event: any) => {
          selectionRect.left = event.rect.left;
          selectionRect.right = event.rect.right;
          selectionRect.top = event.rect.top;
          selectionRect.bottom = event.rect.bottom;
        },
        move: (event: any) => {
          // the client coordinates of top-left layer corner
          const { left: containerLeft, top: containerTop } =
            this.element.getBoundingClientRect();
          let newTop = event.rect.top - containerTop; // these are in client coordinates, so subtract the layer corner coords
          let newBottom = event.rect.bottom - containerTop;
          let newRight = event.rect.right - containerLeft;
          let newLeft = event.rect.left - containerLeft;

          // If snapping is enabled we snap only the edges marked as being changed
          if (this.snappingEnabled) {
            newTop = event.edges.top ? round(newTop, gridSize) : newTop;
            newBottom = event.edges.bottom
              ? round(newBottom, gridSize)
              : newBottom;
            newRight = event.edges.right ? round(newRight, gridSize) : newRight;
            newLeft = event.edges.left ? round(newLeft, gridSize) : newLeft;
          }

          if (this.#selectedElement) {
            // update the element's style
            if (resizableHorizontal) {
              this.#selectedElement.style.width = `${newRight - newLeft}px`;
            }
            if (resizableVertical) {
              this.#selectedElement.style.height = `${newBottom - newTop}px`;
            }
            const translate = `translate(${newLeft}px, ${newTop}px)`;
            this.#selectedElement.style.transform = translate;
            this.#selectedElement.style.webkitTransform = translate;
          }
        },
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent',
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: minWidth, height: minHeight },
        }),
      ],
    });
  }

  #addDragInteraction(): void {
    let deltaX = 0;
    let deltaY = 0;
    let startX = 0;
    let startY = 0;
    const gridSize = 40.0;
    this.interactive.draggable({
      origin: 'parent',
      listeners: {
        start: () => {
          startX = (this.#translation as any).x;
          startY = (this.#translation as any).y;
        },
        move: (event: any) => {
          if (!this.#layoutConfig.movable || !this.#selectedElement) {
            return;
          }
          deltaX += event.dx;
          deltaY += event.dy;

          let x = startX + deltaX;
          let y = startY + deltaY;

          if (this.snappingEnabled) {
            x = Math.floor(x / gridSize + 0.5) * gridSize;
            y = Math.floor(y / gridSize + 0.5) * gridSize;
          }

          // translate the element
          const translate = `translate(${x}px, ${y}px)`;
          this.#selectedElement.style.transform = translate;
          this.#selectedElement.style.webkitTransform = translate;
        },
      },
      modifiers: [
        interact.modifiers.restrict({
          restriction: () => this.element.getBoundingClientRect(),
          elementRect: { left: 0, right: 1, top: 0, bottom: 1 },
        }),
      ],
    });
  }
}

export function addAbsolutePositionLayout(dashboard: FrcDashboard): void {
  const layerElement = dashboard.addLayer('absolutePositioningLayout');
  // eslint-disable-next-line no-new
  new AbsolutePositioningLayout(dashboard, layerElement);
}
