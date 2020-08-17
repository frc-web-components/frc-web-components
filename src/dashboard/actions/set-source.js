import Action from '../action';
import { setWebbitSource } from './utils';

export default class SetSource extends Action {

  constructor() {
    super({
      needsSelection: true,
    });
  }

  execute({ selectedNode, context }) {
    const { sourceProvider, sourceKey } = context;
    setWebbitSource(
      selectedNode.getNode(), 
      sourceProvider,
      sourceKey
    );
  }
}