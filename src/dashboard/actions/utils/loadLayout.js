import { 
  addElement, 
  createElement, 
  setProperties, 
  setWebbitId,
  setWebbitSource
} from './basic';

export const loadLayout = (wom, nodeConfig, parentNode = null) => {
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
    loadLayout(wom, config, node);
  });
}