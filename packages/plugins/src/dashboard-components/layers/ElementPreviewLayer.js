import Layer from "./layer";

export default class ElementPreviewLayer extends Layer {

  #layerElement;

  mount(layerElement, dashboard) {
    this.#layerElement = layerElement;
    const previewBox = this.#createPreviewElement();
    layerElement.appendChild(previewBox);
    dashboard.subscribe('elementPreview', ({ element }) => {
      if (
        element 
        && element !== dashboard.getSelectedElement() 
        && element.tagName.toLowerCase() !== 'dashboard-tab'
      ) {
        this.#setBounds(element, previewBox);
      } else {
        previewBox.style.display = 'none';
      }
    });
  }

  #setBounds(previewElement, previewBox) {
    const { left, top, width, height } = Layer.getElementRect(this.#layerElement, previewElement);
    previewBox.style.left = left + 'px';
    previewBox.style.top = top + 'px';
    previewBox.style.width = width + 'px';
    previewBox.style.height = height + 'px';
    previewBox.style.display = 'block';
  }

  #createPreviewElement() {
    const box = document.createElement('div');
    box.style.background = 'rgba(3, 132, 210, .5)';
    box.style.display = 'none';
    box.style.position = 'absolute';
    document.body.appendChild(box);
    return box;
  }
}