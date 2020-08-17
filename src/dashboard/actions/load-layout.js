import Action from '../action';
import { loadJson } from '../utils';
import { 
  addElement, 
  createElement, 
  setProperties, 
  setWebbitId,
  setWebbitSource
} from './utils';

export default class LoadLayout extends Action {

  constructor() {
    super({
      needsSelection: false,
      needsTarget: false,
    });
  }

  addNode(wom, nodeConfig, parentNode = null) {
    let node = null;
    if (parentNode !== null) {
      const { 
        name, 
        slot, 
        webbit: { properties, id, sourceProvider, sourceKey }
      } = nodeConfig;
      node = createElement(name, slot);
      addElement(wom, node, parentNode, 'inside');
      setProperties(node, properties);
      setWebbitId(node, id);
      setWebbitSource(node, sourceProvider, sourceKey);
    } else {
      node = wom.womNode.getNode();
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