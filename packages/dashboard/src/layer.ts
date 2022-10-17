export function createLayerElement(name: string): HTMLElement {
  const layerElement = document.createElement('div');
  layerElement.setAttribute('slot', 'layer');
  layerElement.setAttribute('layer-id', name);
  layerElement.style.width = '100%';
  layerElement.style.height = '100%';
  layerElement.style.position = 'absolute';
  layerElement.style.top = '0';
  layerElement.style.boxSizing = 'border-box';
  layerElement.style.pointerEvents = 'none';
  return layerElement;
}

export function getElementBoundingBox(
  layerElement: HTMLElement,
  element: HTMLElement
): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const { left: containerLeft, top: containerTop } =
    layerElement.getBoundingClientRect();
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    left: left - containerLeft,
    top: top - containerTop,
    width,
    height,
  };
}

export function addInteractions(layerElement: HTMLElement): void {
  // eslint-disable-next-line no-param-reassign
  layerElement.style.pointerEvents = 'all';
}

export function removeInteractions(layerElement: HTMLElement): void {
  // eslint-disable-next-line no-param-reassign
  layerElement.style.pointerEvents = 'none';
}
