import Action from '../action';

export default class SetProperties extends Action {

  constructor() {
    super({
      needsSelection: true,
    });
  }

  execute({ selectedNode, context }) {
    const { propertyValueMap } = context;
    Object.entries(propertyValueMap).forEach(([property, value]) => {
      const node = selectedNode.getNode();
      if (!node.isPropertyConnectedToSource(property)) {
        node[property] = value;
      }
      node.setDefaultValue(property, value);
    });
  }
}