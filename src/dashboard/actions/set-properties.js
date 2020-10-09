import Action from '../action';
import { setProperties, setWebbitId } from './utils';

export default class SetProperties extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode, context }) {
    const { propertyValueMap, webbitId } = context;

    setProperties(selectedNode.getNode(), propertyValueMap);
    setWebbitId(selectedNode.getNode(), webbitId);

    setTimeout(async () => {
      wom.history.push(await wom.getHtml());
    });
  }
}