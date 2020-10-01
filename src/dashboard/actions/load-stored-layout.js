import Action from '../action';
import { loadLayout } from './utils';

export default class LoadStoredLayout extends Action {

  execute({ wom }) {
    const layoutHtml = wom.history.getStoredLayout();
    if (layoutHtml !== null) {
      wom.history.push(layoutHtml);
      wom.setHtml(layoutHtml);
      wom.deselectNode();
    }
  };
}