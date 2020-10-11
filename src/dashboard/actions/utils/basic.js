
export const createElement = (componentType, slot) => {
  const parentNode = document.createElement('div');
  const { dashboardHtml } = window.webbitRegistry.getMetadata(componentType) || {};
 
  if (dashboardHtml) {
    parentNode.innerHTML = dashboardHtml;
  } else {
    parentNode.innerHTML = `<${componentType}></${componentType}>`;
  }

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

export const hasLayoutChanged = (wom, html) => {
  return wom.history.getCurrentLayout() !== html;
};

export const isLayoutEmpty = (wom) => {
  return wom.womNode.getChildren().length === 0;
};
