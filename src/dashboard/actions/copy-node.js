import Action from '../action';

export default class CopyNode extends Action {

  get needsSelection() {
    return true;
  }

  async execute({ wom, selectedNode }) {
    await wom.setClipboard(selectedNode);
    const nextSelectedNode = selectedNode.getParent();
    wom.selectNode(nextSelectedNode);
  };
}