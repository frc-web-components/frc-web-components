import Action from '../action';

export default class AddNode extends Action {

  constructor() {
    super({
      needsTarget: true
    });

    this.previewedNode = null;
  }

  removePreviewedNode(wom) {
    if (this.previewedNode) {
      this.previewedNode.remove();
      wom.dispatchEvent('womPreviewNodeRemove', { node: this.previewNode });
    }
  }

  createElement(componentType, slot, isPreview) {
    const parentNode = document.createElement('div');
    parentNode.innerHTML = `
      <${componentType}></${componentType}>
    `
    const newElement = parentNode.querySelector(componentType);
    newElement.setAttribute('slot', slot === 'default' ? '' : slot);

    if (isPreview) {
      newElement.setAttribute('is-preview', '');
      newElement.setAttribute('webbit-id', 'preview');
    }

    return newElement;
  }

  addElement(wom, element, targetedNode, placement) {
    if (placement === 'inside') {
      wom.prependNode(element, targetedNode);
    } else if (placement === 'before') {
      wom.insertNodeBefore(element, targetedNode);
    } else {
      wom.insertNodeAfter(element, targetedNode);
    }
  }

  contextChange({
    wom,
    context
  }) {
    this.removePreviewedNode(wom);
    const { placement, targetedNode, componentType, slot } = context;

    if (targetedNode) {
      this.previewedNode = this.createElement(componentType, slot, true);
      this.addElement(wom, this.previewedNode, targetedNode, placement);
      wom.dispatchEvent('womPreviewNodeAdd', { node: this.previewedNode });
    }
  }

  deselect({ wom }) {
    this.removePreviewedNode(wom);
  }

  execute({ 
    wom, 
    targetedNode,
    context
  }) {
    this.removePreviewedNode(wom);
    const { placement, componentType, slot } = context;
    const newElement = this.createElement(componentType, slot);

    const buldNodeCallback = (ev) => {
      const { node } = ev.detail;
      if (node.getNode() === newElement) {
        wom.selectNode(node);
        wom.selectAction('addNode', { componentType });
        wom.removeListener('womNodeBuild', buldNodeCallback);
      }
    };
    wom.addListener('womNodeBuild', buldNodeCallback);

    this.addElement(wom, newElement, targetedNode, placement);
  };
}