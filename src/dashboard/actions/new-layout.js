import Action from '../action';

export default class NewLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  execute({ wom }) {
    wom.womNode.getChildren().forEach(node => {
      wom.removeNode(node);
    })
  };
}