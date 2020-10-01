import Action from '../action';
import { newLayout, isLayoutEmpty } from './utils';

export default class NewLayout extends Action {

  execute({ wom }) {

    if (isLayoutEmpty(wom)) {
      wom.deselectAction();
      return;
    }

    wom.addListenerOnce('womChange', () => {
      wom.history.push(wom.getHtml());
    });
    wom.setHtml('')
    wom.deselectAction();
  };
}