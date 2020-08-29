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
    const { 
      placement, 
      targetedNode, 
      componentType, 
      slot,
      copyWom,
      womPath,
    } = context;

    if (targetedNode) {
      console.log('copyWom, womPath:', copyWom, womPath);
      this.previewedNode = createElement(componentType, slot, true);
      const copiedTargetedNode = copyWom.getNodeFromPath(womPath);
      console.log('copiedTargetedNode:', copiedTargetedNode);
      addElement(wom, this.previewedNode, copiedTargetedNode.getNode(), placement);
      // wom.dispatchEvent('womPreviewNodeAdd', { node: this.previewedNode });
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

    wom.addListenerOnce('womChange', () => {
      wom.selectNode(newElement.__WOM_NODE__);
      wom.selectAction('addNode', { componentType });
      wom.history.push(wom.getJson());
    });

    addElement(wom, newElement, targetedNode.getNode(), placement);
  };
}