import Action from '../action';
import { loadLayout } from './utils';

export default class LoadStoredLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  execute({ wom }) {
    const layoutJson = wom.history.getStoredLayout();
    console.log('layoutJson', layoutJson);
    if (layoutJson) {
      wom.history.push(layoutJson);
      loadLayout(wom, layoutJson);
      wom.deselectNode();
    }
  };
}