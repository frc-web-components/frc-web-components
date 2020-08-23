import Action from '../action';
import { loadJson } from '../utils';
import { loadLayout, hasLayoutChanged } from './utils';

export default class LoadLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  execute({ wom }) {
    loadJson().then(({ result, error }) => {
      if (error) {
        alert('error loading layout!');
        return;
      }
      if (!hasLayoutChanged(wom, result)) {
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