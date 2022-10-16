import { FrcDashboard } from '@frc-web-components/dashboard';

// class DragAndDropLayer extends Layer {
//   mount(): void {
//     console.log(this);
//   }
//   unmount(): void {
//     console.log(this);
//   }
// }

export function addDragAndDrop(dashboard: FrcDashboard): void {
  // eslint-disable-next-line no-new
  // new DragAndDropLayer('dragAndDrop', dashboard);
  dashboard.addLayer('dragAndDrop');
}
