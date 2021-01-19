import Action from '../action';

export default class SaveLayout extends Action {

  async execute({ wom }) {
    const name = wom.layout.getOpenedLayoutName();
    const html = await wom.getHtml();
    wom.layout.saveLayout(name, html);
    wom.layout.setTitleFromLayoutName();
  };
}