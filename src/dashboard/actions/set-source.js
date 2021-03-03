import Action from '../action';

export default class SetSource extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode, context }) {
    const { sourceProvider, sourceKey } = context;
    selectedNode.setSource(sourceProvider, sourceKey);

    setTimeout(async () => {
      wom.history.push(await wom.getHtml());
    });
  }
}