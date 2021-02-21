import Action from '../action';
import { saveHtml } from '../utils';

export default class DownloadLayout extends Action {

  async execute({ wom }) {
    const html = await wom.getHtml();
    const layoutName = wom.layout.getOpenedLayoutName();
    saveHtml(html, `${layoutName}.fwc`);
  };
}