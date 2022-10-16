/* eslint-disable no-param-reassign */
import {
  FrcDashboard,
  getElementBoundingBox,
} from '@frc-web-components/dashboard';

function createPreviewElement(): HTMLElement {
  const box = document.createElement('div');
  box.style.background = 'rgba(3, 132, 210, .5)';
  box.style.display = 'none';
  box.style.position = 'absolute';
  document.body.appendChild(box);
  return box;
}

function setBounds(
  layerElement: HTMLElement,
  previewElement: HTMLElement,
  previewBox: HTMLElement
) {
  const { left, top, width, height } = getElementBoundingBox(
    layerElement,
    previewElement
  );
  previewBox.style.left = `${left}px`;
  previewBox.style.top = `${top}px`;
  previewBox.style.width = `${width}px`;
  previewBox.style.height = `${height}px`;
  previewBox.style.display = 'block';
}

export function addElementPreview(dashboard: FrcDashboard): void {
  const layerElement = dashboard.addLayer('elementPreview');
  const previewBox = createPreviewElement();
  layerElement.appendChild(previewBox);
  dashboard.subscribe('elementPreview', (value: any) => {
    const previewElement = value.element as HTMLElement;
    if (
      previewElement &&
      previewElement !== dashboard.getSelectedElement() &&
      previewElement.tagName.toLowerCase() !== 'dashboard-tab'
    ) {
      setBounds(layerElement, previewElement, previewBox);
    } else {
      previewBox.style.display = 'none';
    }
  });
}
