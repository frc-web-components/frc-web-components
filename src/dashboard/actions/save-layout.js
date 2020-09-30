import Action from '../action';
import { saveJson } from '../utils';

export default class SaveLayout extends Action {

  execute({ wom }) {
    const json = wom.getJson();
    saveJson(json);
    wom.deselectAction();
  };
}