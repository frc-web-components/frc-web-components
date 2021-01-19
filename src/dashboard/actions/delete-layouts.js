import Action from '../action';

export default class DeleteLayouts extends Action {

  execute({ wom, context }) {
    const { layouts } = context;
    layouts.forEach(layout => {
      wom.layout.deleteLayout(layout);
    });
  };
}