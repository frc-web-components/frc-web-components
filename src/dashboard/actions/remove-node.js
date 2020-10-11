import Action from '../action';

export default class RemoveNode extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode }) {
    const nextSelectedNode = (
      selectedNode.getNextSibling()
      || selectedNode.getPreviousSibling()
      || selectedNode.getParent()
    );
    
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
  }
}