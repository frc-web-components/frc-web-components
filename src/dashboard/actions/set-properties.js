import Action from '../action';
import { setProperties } from './utils';

export default class SetProperties extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode, context }) {
    const { propertyValueMap } = context;

    setProperties(selectedNode.getNode(), propertyValueMap);

    setTimeout(async () => {
      wom.history.push(await wom.getHtml());
    });
  }
}