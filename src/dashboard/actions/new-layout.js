import Action from '../action';

export default class NewLayout extends Action {

  execute({ wom }) {
    wom.addListenerOnce('womChange', async () => {
      wom.history.push(await wom.getHtml());
    });
    const name = wom.layout.generateLayoutName();
    wom.layout.openSavedLayout(name);
    wom.history.clear();
    wom.setHtml('');
  };
}