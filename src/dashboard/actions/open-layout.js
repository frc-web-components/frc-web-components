import Action from '../action';

export default class OpenLayout extends Action {

  execute({ wom, context }) {
    
    const { layoutName } = context;

    const layoutHtml = wom.layout.openSavedLayout(layoutName);
    wom.layout.setTitleFromLayoutName();

    wom.history.clear();
    wom.history.push(layoutHtml);
    wom.setHtml(layoutHtml);
    wom.deselectNode();
  };
}