import Action from '../action';
import { setProperties, setWebbitId } from './utils';

export default class SetProperties extends Action {

  constructor() {
    super({
      needsSelection: true,
    });
  }

  execute({ wom, selectedNode, context }) {
    const { propertyValueMap, webbitId } = context;
    setProperties(selectedNode.getNode(), propertyValueMap);
    setWebbitId(selectedNode.getNode(), webbitId);
    wom.history.push(wom.getJson());
  }
}