import Dashboard from './dashboard';

export default abstract class Layer {
  static getElementRect(
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

  abstract mount(element: HTMLElement, dashboard: Dashboard, id: string): void;
  abstract unmount(
    element: HTMLElement,
    dashboard: Dashboard,
    id: string
  ): void;
}
