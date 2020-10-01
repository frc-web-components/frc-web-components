import Action from '../action';
import { saveHtml } from '../utils';

export default class SaveLayout extends Action {

  execute({ wom }) {
    const html = wom.getHtml();
    saveHtml(html);
    wom.deselectAction();
  };
}