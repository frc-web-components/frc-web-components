
export default class Layer {

  static getElementRect(layerElement, element) {
    const { left: containerLeft, top: containerTop } = layerElement.getBoundingClientRect();
    const { left, top, width, height } = element.getBoundingClientRect();
    return {
      left: left - containerLeft,
      top: top - containerTop,
      width,
      height,
    };
  }

  mount(element, dashboard) {}
  unmount(element, dashboard) {}
}