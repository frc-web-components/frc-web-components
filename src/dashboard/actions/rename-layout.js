import Action from '../action';

export default class RenameLayout extends Action {

  async execute({ wom, context }) {
    const { name } = context;
    wom.layout.renameOpenedLayout(name);
    const html = await wom.getHtml();
    wom.layout.saveLayout(name, html);
  };
}