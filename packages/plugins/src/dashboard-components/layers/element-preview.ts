/* eslint-disable no-param-reassign */
import { FrcDashboard, Layer } from '@frc-web-components/dashboard';

function createPreviewElement(): HTMLElement {
  const box = document.createElement('div');
  box.style.background = 'rgba(3, 132, 210, .5)';
  box.style.display = 'none';
  box.style.position = 'absolute';
  document.body.appendChild(box);
  return box;
}

class ElementPreviewLayer extends Layer {
  mount(): void {
    const previewBox = createPreviewElement();
    this.element.appendChild(previewBox);
    this.dashboard.subscribe('elementPreview', (value: any) => {
      const previewElement = value.element as HTMLElement;
      if (
        previewElement &&
        previewElement !== this.dashboard.getSelectedElement() &&
        previewElement.tagName.toLowerCase() !== 'dashboard-tab'
      ) {
        this.#setBounds(previewElement, previewBox);
      } else {
        previewBox.style.display = 'none';
      }
    });
  }

  #setBounds(previewElement: HTMLElement, previewBox: HTMLElement) {
    const { left, top, width, height } = Layer.getElementRect(
      this.element,
      previewElement
    );
    previewBox.style.left = `${left}px`;
    previewBox.style.top = `${top}px`;
    previewBox.style.width = `${width}px`;
    previewBox.style.height = `${height}px`;
    previewBox.style.display = 'block';
  }
}

export function addElementPreview(dashboard: FrcDashboard): void {
  // eslint-disable-next-line no-new
  new ElementPreviewLayer('elementPreview', dashboard);
}
