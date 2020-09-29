import Action from '../action';
import { addElement, createElement } from './utils';


const getAllWomNodes = (womNode) => {
  let allNodes = [womNode];
  womNode.getChildren().forEach(child => {
    allNodes = allNodes.concat(getAllWomNodes(child));
  });
  return allNodes;
};

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
    const { placement, componentType, slot } = context;
    const newElement = createElement(componentType, slot);

    wom.addListenerOnce('womChange', () => {
      wom.selectNode(newElement.__WOM_NODE__);
      wom.selectAction('addNode', { componentType });
      wom.history.push(wom.getJson());
    });
    
    this.removePreviewedNode(wom);
    addElement(wom, newElement, targetedNode.getNode(), placement);
  };
}