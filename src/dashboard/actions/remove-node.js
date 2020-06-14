import Action from '../action';

export default class RemoveNode extends Action {

  constructor() {
    super({
      needsSelection: true
    });
  }

  execute({ wom, selectedNode }) {
    wom.deselectNode();
    wom.removeNode(selectedNode);
  }
}