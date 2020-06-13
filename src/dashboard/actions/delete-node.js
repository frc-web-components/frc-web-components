import Action from '../action';

export default class DeleteNode extends Action {

  constructor() {
    super({
      needsSelection: true
    });
  }

  execute({ wom, selectedNode }) {
    wom.removeNode(selectedNode);
  }
}