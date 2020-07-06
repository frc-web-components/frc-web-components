import Action from '../action';

export default class RemoveNode extends Action {

  constructor() {
    super({
      needsSelection: true
    });
  }

  execute({ wom, selectedNode }) {
    const nextSelectedNode = (
      selectedNode.getNextSibling()
      || selectedNode.getPreviousSibling()
      || selectedNode.getParent()
    );
    if (nextSelectedNode) {
      wom.selectNode(nextSelectedNode);
    } else {
      wom.deselectNode();
    }
    wom.removeNode(selectedNode);
  }
}