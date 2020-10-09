import Action from '../action';
import { newLayout, isLayoutEmpty } from './utils';

export default class NewLayout extends Action {

  execute({ wom }) {
    if (!isLayoutEmpty(wom)) {
      wom.addListenerOnce('womChange', async () => {
        wom.history.push(await wom.getHtml());
      });
      wom.setHtml('');
    }
  };
}