import Action from '../action';
import { setProperties } from './utils';

export default class SetProperties extends Action {

  constructor() {
    super({
      needsSelection: true,
    });
  }

  execute({ selectedNode, context }) {
    const { propertyValueMap } = context;
    setProperties(selectedNode.getNode(), propertyValueMap);
  }
}