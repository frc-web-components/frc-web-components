import Action from '../action';
import { saveHtml } from '../utils';

export default class SaveLayout extends Action {

  async execute({ wom }) {
    const html = await wom.getHtml();
    saveHtml(html);
  };
}