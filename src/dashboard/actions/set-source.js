import Action from '../action';
import { setWebbitSource } from './utils';

export default class SetSource extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode, context }) {
    const { sourceProvider, sourceKey, fromProperties } = context;
    setWebbitSource(
      selectedNode.getNode(), 
      sourceProvider,
      sourceKey,
      fromProperties
    );
    setTimeout(async () => {
      wom.history.push(await wom.getHtml());
    });
  }
}