import Action from '../action';
import { setProperties, setWebbitId } from './utils';

export default class SetProperties extends Action {

  constructor() {
    super({
      needsSelection: true,
    });
  }

  execute({ selectedNode, context }) {
    const { propertyValueMap, webbitId } = context;
    setProperties(selectedNode.getNode(), propertyValueMap);
    setWebbitId(selectedNode.getNode(), webbitId)
  }
}