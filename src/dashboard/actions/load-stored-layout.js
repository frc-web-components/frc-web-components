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
    const layoutJson = wom.history.getStoredLayout() || wom.getJson();
    wom.history.push(layoutJson);
    loadLayout(wom, layoutJson);
  };
}