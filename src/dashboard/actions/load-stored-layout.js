import Action from '../action';
import { loadLayout } from './utils';

export default class LoadStoredLayout extends Action {

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