import { Dashboard, FrcDashboard, Layer } from '@frc-web-components/dashboard';

export default class DragAndDropLayer extends Layer {
  mount(element: HTMLElement, dashboard: Dashboard): void {
    console.log(this);
  }
  unmount(element: HTMLElement, dashboard: Dashboard): void {
    console.log(this);
  }
}
