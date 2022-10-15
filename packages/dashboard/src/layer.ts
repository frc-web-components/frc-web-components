/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-empty-function */
// import FrcDashboard from './frc-dashboard';

export default class Layer2 {
  // protected dashboard: FrcDashboard;
  // protected id: string;
  // protected element!: HTMLElement;
  // static getElementRect(
  //   layerElement: HTMLElement,
  //   element: HTMLElement
  // ): {
  //   left: number;
  //   top: number;
  //   width: number;
  //   height: number;
  // } {
  //   const { left: containerLeft, top: containerTop } =
  //     layerElement.getBoundingClientRect();
  //   const { left, top, width, height } = element.getBoundingClientRect();
  //   return {
  //     left: left - containerLeft,
  //     top: top - containerTop,
  //     width,
  //     height,
  //   };
  // }
  // constructor(id: string, dashboard: FrcDashboard) {
  //   this.id = id;
  //   this.dashboard = dashboard;
  //   dashboard.addComponent({
  //     type: 'layer',
  //     id,
  //     mount: ({ element }) => {
  //       this.element = element;
  //       this.mount();
  //       return () => {
  //         this.unmount();
  //       };
  //     },
  //   });
  //   const layerElement = dashboard.create('layer', id, {});
  //   if (layerElement) {
  //     layerElement.setAttribute('slot', 'layer');
  //     layerElement.setAttribute('layer-id', id);
  //     layerElement.style.display = 'none';
  //     layerElement.style.width = '100%';
  //     layerElement.style.height = '100%';
  //     layerElement.style.position = 'absolute';
  //     layerElement.style.top = '0';
  //     layerElement.style.boxSizing = 'border-box';
  //     layerElement.style.pointerEvents = 'none';
  //   }
  // }
  // show(): void {
  //   this.element.style.display = 'block';
  // }
  // hide(): void {
  //   this.element.style.display = 'none';
  // }
  // addPointerEvents(): void {
  //   this.element.style.pointerEvents = 'all';
  // }
  // removePointerEvents(): void {
  //   this.element.style.pointerEvents = 'none';
  // }
  // mount(): void {}
  // unmount(): void {}
}
