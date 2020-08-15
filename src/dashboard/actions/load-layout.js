import Action from '../action';
import { loadJson } from '../utils';

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
      wom.selectAction('newLayout');
      console.log('layout:', result);
    });
  };
}