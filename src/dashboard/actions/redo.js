import Action from '../action';

export default class Redo extends Action {

  execute({ wom }) {
    wom.history.goForward();
    const layoutHtml = wom.history.getCurrentLayout();
    wom.setHtml(layoutHtml);
    wom.deselectNode();
  };
}