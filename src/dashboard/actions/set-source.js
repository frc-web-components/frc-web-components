import Action from '../action';

export default class SetSource extends Action {

  constructor() {
    super({
      needsSelection: true,
    });
  }

  execute({ selectedNode, context }) {
    const { sourceProvider, sourceKey } = context;
    selectedNode.getNode().sourceProvider = sourceProvider;
    selectedNode.getNode().sourceKey = sourceKey;
  }
}