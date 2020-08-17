import Action from '../action';
import { addElement, createElement } from './utils';

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

  contextChange({
    wom,
    context
  }) {
    this.removePreviewedNode(wom);
    const { placement, targetedNode, componentType, slot } = context;

    if (targetedNode) {
      this.previewedNode = createElement(componentType, slot, true);
      addElement(wom, this.previewedNode, targetedNode.getNode(), placement);
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
    const newElement = createElement(componentType, slot);

    const buldNodeCallback = (ev) => {
      const { node } = ev.detail;
      if (node.getNode() === newElement) {
        wom.selectNode(node);
        wom.selectAction('addNode', { componentType });
        wom.removeListener('womNodeBuild', buldNodeCallback);
      }
    };
    wom.addListener('womNodeBuild', buldNodeCallback);

    addElement(wom, newElement, targetedNode.getNode(), placement);
  };
}