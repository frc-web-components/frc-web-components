import Action from '../action';
import { createElement } from './utils';


const getAllWomNodes = (womNode) => {
  let allNodes = [womNode];
  womNode.getChildren().forEach(child => {
    allNodes = allNodes.concat(getAllWomNodes(child));
  });
  return allNodes;
};

export default class AddNode extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, context }) {
    const { componentType, slot } = context;
    const newElement = createElement(componentType, slot);

    wom.addListenerOnce('womChange', () => {
      wom.selectNode(newElement.__WOM_NODE__);
      wom.selectAction('addNode', { componentType });
      wom.history.push(wom.getJson());
    });    
  };
}