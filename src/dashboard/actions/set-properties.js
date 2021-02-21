import Action from '../action';
import { setProperties, setWebbitName } from './utils';

export default class SetProperties extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode, context }) {
    const { propertyValueMap, webbitName } = context;

    setProperties(selectedNode.getNode(), propertyValueMap);
    setWebbitName(selectedNode.getNode(), webbitName);

    setTimeout(async () => {
      wom.history.push(await wom.getHtml());
    });
  }
}