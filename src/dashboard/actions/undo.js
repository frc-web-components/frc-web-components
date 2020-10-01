import Action from '../action';
import { loadLayout } from './utils';

export default class Undo extends Action {

  execute({ wom }) {
    wom.history.goBack();
    const layoutHtml = wom.history.getCurrentLayout();
    wom.setHtml(layoutHtml);
    wom.deselectNode();
  };
}