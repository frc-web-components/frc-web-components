import Action from '../action';
import { loadJson } from '../utils';
import { loadLayout, hasLayoutChanged } from './utils';

export default class LoadLayout extends Action {

  execute({ wom }) {
    loadJson().then(({ result, error }) => {
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
        wom.history.push(wom.getJson());
      });
      loadLayout(wom, result);
      wom.deselectNode();
    });
  };
}