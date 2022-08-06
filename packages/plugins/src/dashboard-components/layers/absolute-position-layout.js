import Layer from "./layer";
import DashboardSelections from "./dashboard-selections";
import interact from 'interactjs';
import getTranslationFromStyles from "./getTranslationFromStyles";

export default class AbsolutePositioningLayout extends Layer {

  #layerElement;
  #dashboard;
  #interactive;
  #selectionBox = this.createSelectionBox();

  mount(layerElement, dashboard) {
    this.#layerElement = layerElement;
    this.#dashboard = dashboard;

    new DashboardSelections(dashboard.getConnector(), element => {
      dashboard.setSelectedElement(element);
    });

    dashboard.subscribe('elementSelect', () => {
      if (this.#selectedElement) {
        this.#addResizeInteraction();
      }
    });

    layerElement.appendChild(this.#selectionBox);
    this.#interactive = interact(this.#selectionBox);

    this.#interactive.on('resizeend', () => {
      this.#addResizeInteraction();
    });

    this.#setBounds();
    this.#addDragInteraction();
  }

  #setBounds() {
    const selectedElement = this.#dashboard?.getSelectedElement();
    if (
      this.#dashboard.isDrawerOpened()
      && selectedElement
      && selectedElement.tagName.toLowerCase() !== 'dashboard-tab'
    ) {
      const { left, top, width, height } = Layer.getElementRect(this.#layerElement, selectedElement);
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
      resizableVertical: layout?.resizable !== false && (layout?.resizable?.vertical ?? true),
      resizableHorizontal: layout?.resizable !== false && (layout?.resizable?.horizontal ?? true),
      movable: layout?.movable ?? true,
      minWidth: layout?.size?.minWidth ?? 20,
      minHeight: layout?.size?.minHeight ?? 20,
    };
  }

  #addResizeInteraction() {
    const {
      resizableHorizontal,
      resizableVertical,
      minWidth,
      minHeight,
    } = this.#layoutConfig;

    const { width, height } = this.#selectedElement.getBoundingClientRect();
    let selectionWidth = 0;
    let selectionHeight = 0;

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
          selectionWidth = event.rect.width;
          selectionHeight = event.rect.height;
        },
        move: (event) => {
          let { x, y } = this.#translation;
          const deltaWidth = event.rect.width - selectionWidth;
          const deltaHeight = event.rect.height - selectionHeight;
          const newWidth = width + deltaWidth;
          const newHeight = height + deltaHeight;

          // update the element's style
          if (resizableHorizontal) {
            this.#selectedElement.style.width = `${newWidth}px`;
          }
          if (resizableVertical) {
            this.#selectedElement.style.height = `${newHeight}px`;
          }

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          this.#selectedElement.style.webkitTransform = this.#selectedElement.style.transform =
            `translate(${x}px, ${y}px)`;
        },
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent',
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: minWidth, height: minHeight }
        })
      ],
    });
  }

  #addDragInteraction() {
    this.#interactive.draggable({
      listeners: {
        move: (event) => {
          if (!this.#layoutConfig.movable || !this.#selectedElement) {
            return;
          }

          let { x, y } = this.#translation;
          x += event.dx;
          y += event.dy;

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
        })
      ],
    });
  }

  createSelectionBox() {
    const box = document.createElement('div');
    box.style.border = '2px dashed green';
    box.style.display = 'none';
    box.style.position = 'absolute';
    box.style.pointerEvents = 'all';
    return box;
  }
}