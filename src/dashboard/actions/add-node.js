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

    if (context.dragAndDrop) {

      const { 
        componentType, 
        slot, 
        parentNode, 
        mousePosition, 
        closestTo
      } = context;

      this.previewedNode = createElement(componentType, slot, true);



      parentNode.placeLayoutElement(this.previewedNode, {
        x: mousePosition.x,
        y: mousePosition.y,
        width: this.previewedNode.offsetWidth,
        height: this.previewedNode.offsetHeight,
        closestTo: {
          ...closestTo,
          node: closestTo.node.getNode()
        }
      });


    } else {
      const { placement, targetedNode, componentType, slot } = context;

      if (targetedNode) {
        this.previewedNode = createElement(componentType, slot, true);
        addElement(wom, this.previewedNode, targetedNode.getNode(), placement);
        wom.dispatchEvent('womPreviewNodeAdd', { node: this.previewedNode });
      }
    }
  }

  select({ wom, context }) {
    const { componentType } = context;
    console.log('select', componentType);
  }

  deselect({ wom }) {
    this.removePreviewedNode(wom);
    console.log('deselect');
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
    
    if (!context.dragAndDrop) {
      addElement(wom, newElement, targetedNode.getNode(), placement);
    } else {
      targetedNode.getNode().replaceChild(newElement, this.previewedNode);
      this.removePreviewedNode(wom);
    }

    this.removePreviewedNode(wom);
  };
}