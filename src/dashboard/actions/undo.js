import Action from '../action';
import { loadLayout } from './utils';

export default class Undo extends Action {
  
  execute({ wom }) {
    wom.history.goBack();
    const layoutJson = wom.history.getCurrentLayout();
    loadLayout(wom, layoutJson);
    wom.deselectNode();
  };
}