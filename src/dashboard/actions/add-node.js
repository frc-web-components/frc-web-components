import Action from '../action';
import { createElement } from './utils';

export default class AddNode extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, context }) {
    const { componentType, slot } = context;
    const newElement = createElement(componentType, slot);

    wom.addListenerOnce('womChange', () => {
      wom.history.push(wom.getHtml());
    });    
  };
}