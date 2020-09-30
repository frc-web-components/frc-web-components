
export const createElement = (componentType, slot) => {
  const parentNode = document.createElement('div');
  parentNode.innerHTML = `
    <${componentType}></${componentType}>
  `
  const newElement = parentNode.querySelector(componentType);
  newElement.setAttribute('slot', slot === 'default' ? '' : slot);
  return newElement;
};

export const setProperties = (node, propertyValueMap) => {
  Object.entries(propertyValueMap).forEach(([property, value]) => {
    if (!node.isPropertyConnectedToSource(property)) {
      node[property] = value;
    }
    node.setDefaultValue(property, value);
  });
};

export const setWebbitId = (node, webbitId) => {
  node.webbitId = webbitId;
};

export const setWebbitSource = (node, sourceProvider, sourceKey) => {
  node.sourceProvider = sourceProvider;
  node.sourceKey = sourceKey;
};

export const hasLayoutChanged = (wom, layoutJson) => {
  const jsonString = JSON.stringify(layoutJson);
  const currentJsonString = JSON.stringify(wom.history.getCurrentLayout());
  return jsonString !== currentJsonString;
};

export const isLayoutEmpty = (wom) => {
  return wom.womNode.getChildren().length === 0;
};

export const newLayout = (wom) => {
  wom.womNode.getChildren().forEach(node => {
    wom.removeNode(node);
  });
};