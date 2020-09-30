import Action from '../action';
import { loadLayout } from './utils';

export default class Redo extends Action {

  execute({ wom }) {
    wom.history.goForward();
    const layoutJson = wom.history.getCurrentLayout();
    loadLayout(wom, layoutJson);
    wom.deselectNode();
  };
}