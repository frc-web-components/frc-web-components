import Action from '../action';
import { loadJson } from '../utils';

export default class LoadLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  async addNode(wom, nodeConfig, parentNode = null) {

    let node = null;

    if (parentNode !== null) {
      wom.selectAction('addNode', {
        componentType: nodeConfig.name,
        placement: 'inside',
        slot: nodeConfig.slot,
      });
      wom.targetNode(parentNode);
    } else {
      node = wom.womNode;
    }

    nodeConfig.children.reverse().forEach(config => {
      this.addNode(wom, config, node);
    });
  }

  execute({ wom }) {
    loadJson().then(({ result, error }) => {
      if (error) {
        alert('error loading layout!');
        return;
      }
      wom.selectAction('newLayout');
      this.addNode(wom, result);
      wom.deselectNode();
    });
  };
}