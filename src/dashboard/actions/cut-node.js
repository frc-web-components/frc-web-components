import Action from '../action';

export default class CutNode extends Action {

  get needsSelection() {
    return true;
  }

  async execute({ wom, selectedNode }) {
    await wom.setClipboard(selectedNode);

    const nextSelectedNode = selectedNode.getParent();
    
    if (!nextSelectedNode) {
      wom.deselectNode();
    }

    wom.addListenerOnce('womChange', async () => {
      wom.history.push(await wom.getHtml());
      if (nextSelectedNode) {
        wom.selectNode(nextSelectedNode);
      }
    });

    wom.removeNode(selectedNode);
  };
}