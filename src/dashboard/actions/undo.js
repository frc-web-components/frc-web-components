import Action from '../action';
import { loadLayout } from './utils';

export default class Undo extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  execute({ wom }) {
    wom.history.goBack();
    wom.selectAction('newLayout');
    const layoutJson = wom.history.getCurrentLayout();
    loadLayout(wom, layoutJson);
    wom.deselectNode();
  };
}