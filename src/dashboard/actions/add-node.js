import Action from '../action';
import { createElement } from './utils';

export default class AddNode extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, context, selectedNode }) {
    const { componentType, slot, prepend } = context;
    const newElement = createElement(componentType, slot);

    wom.addListenerOnce('womChange', async () => {
      wom.history.push(await wom.getHtml());
    });

    if (prepend) {
      selectedNode.getNode().prepend(newElement);
    } else {
      selectedNode.getNode().append(newElement);
    }
  };
}