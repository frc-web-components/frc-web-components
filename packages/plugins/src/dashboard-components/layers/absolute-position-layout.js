import Layer from './layer';
import DashboardSelections from './dashboard-selections';
import interact from 'interactjs';
import getTranslationFromStyles from './getTranslationFromStyles';

export default class AbsolutePositioningLayout extends Layer {
  #layerElement;
  #dashboard;
  #interactive;
  #selectionBox = this.createSelectionBox();

  #snappingEnabled;
  #gridSize;

  mount(layerElement, dashboard) {
    this.#layerElement = layerElement;
    this.#dashboard = dashboard;
    this.#snappingEnabled = false;
    this.#gridSize = 40.0;

    new DashboardSelections(dashboard.getConnector(), (element) => {
      if (dashboard.isElementEditable()) {
        dashboard.setSelectedElement(element);
      }
    });

    dashboard.subscribe('elementSelect', () => {
      if (this.#selectedElement) {
        this.#addResizeInteraction();
        this.#addDragInteraction();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') {
        this.#selectionBox.style.border = '2px solid blue';
        this.#snappingEnabled = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control') {
        this.#selectionBox.style.border = '2px dashed green';
        this.#snappingEnabled = false;
      }
    });

    layerElement.appendChild(this.#selectionBox);
    this.#interactive = interact(this.#selectionBox);

    this.#interactive.on('resizeend', () => {
      this.#addResizeInteraction();
    });

    this.#interactive.on('dragend', () => {
      this.#addDragInteraction();
    });
    this.#setBounds();
    this.#addDragInteraction();
  }

  #setBounds() {
    const selectedElement = this.#dashboard?.getSelectedElement();
    if (
      this.#dashboard.isDrawerOpened() &&
      selectedElement &&
      selectedElement.tagName.toLowerCase() !== 'dashboard-tab'
    ) {
      const { left, top, width, height } = Layer.getElementRect(
        this.#layerElement,
        selectedElement
      );
      this.#selectionBox.style.left = left + 'px';
      this.#selectionBox.style.top = top + 'px';
      this.#selectionBox.style.width = width + 'px';
      this.#selectionBox.style.height = height + 'px';
      this.#selectionBox.style.display = 'block';
    } else {
      this.#selectionBox.style.display = 'none';
    }

    window.requestAnimationFrame(() => {
      this.#setBounds();
    });
  }

  #getLayout() {
    return this.#dashboard
      .getConnector()
      .getMatchingElementConfig(this.#selectedElement)?.dashboard?.layout;
  }

  get #selectedElement() {
    return this.#dashboard?.getSelectedElement();
  }

  get #translation() {
    if (!this.#selectedElement) {
      return { x: 0, y: 0, z: 0 };
    }
    return getTranslationFromStyles(this.#selectedElement);
  }

  get #layoutConfig() {
    const layout = this.#getLayout();
    return {
      type: layout?.type,
      resizableVertical:
        layout?.resizable !== false && (layout?.resizable?.vertical ?? true),
      resizableHorizontal:
        layout?.resizable !== false && (layout?.resizable?.horizontal ?? true),
      movable: layout?.movable ?? true,
      minWidth: layout?.size?.minWidth ?? 20,
      minHeight: layout?.size?.minHeight ?? 20,
    };
  }

  round(val, gridSize) {
    return Math.floor(val / gridSize + 0.5) * gridSize;
  }

  #addResizeInteraction() {
    const { resizableHorizontal, resizableVertical, minWidth, minHeight } =
      this.#layoutConfig;

    const { width, height } = this.#selectedElement.getBoundingClientRect();
    let selectionRect = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
    let gridSize = this.#gridSize;

    this.#interactive.resizable({
      // // resize from all edges and corners
      edges: {
        left: resizableHorizontal && width > 60,
        right: resizableHorizontal,
        top: resizableVertical && height > 60,
        bottom: resizableVertical,
      },
      listeners: {
        start: (event) => {
          selectionRect.left = event.rect.left;
          selectionRect.right = event.rect.right;
          selectionRect.top = event.rect.top;
          selectionRect.bottom = event.rect.bottom;
        },
        move: (event) => {
          // the client coordinates of top-left layer corner
          const { left: containerLeft, top: containerTop } =
            this.#layerElement.getBoundingClientRect();
          let newTop = event.rect.top - containerTop; // these are in client coordinates, so subtract the layer corner coords
          let newBottom = event.rect.bottom - containerTop;
          let newRight = event.rect.right - containerLeft;
          let newLeft = event.rect.left - containerLeft;

          // If snapping is enabled we snap only the edges marked as being changed
          if (this.#snappingEnabled) {
            newTop = event.edges.top ? this.round(newTop, gridSize) : newTop;
            newBottom = event.edges.bottom
              ? this.round(newBottom, gridSize)
              : newBottom;
            newRight = event.edges.right
              ? this.round(newRight, gridSize)
              : newRight;
            newLeft = event.edges.left
              ? this.round(newLeft, gridSize)
              : newLeft;
          }

          // update the element's style
          if (resizableHorizontal) {
            this.#selectedElement.style.width = `${newRight - newLeft}px`;
          }
          if (resizableVertical) {
            this.#selectedElement.style.height = `${newBottom - newTop}px`;
          }

          this.#selectedElement.style.webkitTransform =
            this.#selectedElement.style.transform = `translate(${newLeft}px, ${newTop}px)`;
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

  #addDragInteraction() {
    let deltaX = 0;
    let deltaY = 0;
    let startX = 0;
    let startY = 0;
    let gridSize = 40.0;
    this.#interactive.draggable({
      origin: 'parent',
      listeners: {
        start: (event) => {
          startX = this.#translation.x;
          startY = this.#translation.y;
        },
        move: (event) => {
          if (!this.#layoutConfig.movable || !this.#selectedElement) {
            return;
          }
          deltaX += event.dx;
          deltaY += event.dy;

          let x = startX + deltaX;
          let y = startY + deltaY;

          if (this.#snappingEnabled) {
            x = Math.floor(x / gridSize + 0.5) * gridSize;
            y = Math.floor(y / gridSize + 0.5) * gridSize;
          }

          // translate the element
          this.#selectedElement.style.webkitTransform =
            this.#selectedElement.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';
        },
      },
      modifiers: [
        interact.modifiers.restrict({
          restriction: () => {
            return this.#layerElement.getBoundingClientRect();
          },
          elementRect: { left: 0, right: 1, top: 0, bottom: 1 },
        }),
      ],
    });
  }

  createSelectionBox() {
    const box = document.createElement('div');
    box.style.border = '2px dashed green';
    box.style.boxSizing = 'border-box';
    box.style.display = 'none';
    box.style.position = 'absolute';
    box.style.pointerEvents = 'all';
    return box;
  }
}
