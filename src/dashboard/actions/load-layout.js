import Action from '../action';
import { loadHtml } from '../utils';
import { hasLayoutChanged } from './utils';

export default class LoadLayout extends Action {

  execute({ wom }) {
    loadHtml().then(({ result, error }) => {
      if (error) {
        alert('error loading layout!');
        return;
      }
      if (!hasLayoutChanged(wom, result)) {
        return;
      }
      wom.addListenerOnce('womChange', async () => {
        wom.history.push(await wom.getHtml());
      });
      wom.setHtml(result);
    });
  };
}