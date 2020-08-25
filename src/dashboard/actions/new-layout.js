import Action from '../action';
import { newLayout, isLayoutEmpty } from './utils';

export default class NewLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  execute({ wom }) {

    if (isLayoutEmpty(wom)) {
      wom.deselectAction();
      return;
    }

    wom.addListenerOnce('womChange', () => {
      wom.history.push(wom.getJson());
    });
    newLayout(wom);
    wom.deselectAction();
  };
}