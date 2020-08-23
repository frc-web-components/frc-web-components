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
      return;
    }

    wom.addListenerOnce('womChange', () => {
      wom.history.push(wom.getJson());
    });
    newLayout(wom);
  };
}