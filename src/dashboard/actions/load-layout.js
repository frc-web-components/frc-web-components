import Action from '../action';
import { loadHtml } from '../utils';
import { hasLayoutChanged } from './utils';

export default class LoadLayout extends Action {

  execute({ wom }) {
    loadHtml().then(({ result, error }) => {
      if (error) {
        alert('error loading layout!');
        wom.deselectAction();
        return;
      }
      if (!hasLayoutChanged(wom, result)) {
        wom.deselectAction();
        return;
      }
      wom.addListenerOnce('womChange', () => {
        wom.history.push(wom.getHtml());
      });
      wom.setHtml(result);
    });
  };
}