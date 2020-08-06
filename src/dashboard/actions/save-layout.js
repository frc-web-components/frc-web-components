import Action from '../action';
import { saveJson } from '../utils';

export default class SaveLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  execute({ wom }) {
    const json = wom.getJson();
    saveJson(json);
  };
}