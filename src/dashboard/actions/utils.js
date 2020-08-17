
export const createElement = (componentType, slot, isPreview) => {
  const parentNode = document.createElement('div');
  parentNode.innerHTML = `
    <${componentType}></${componentType}>
  `
  const newElement = parentNode.querySelector(componentType);
  newElement.setAttribute('slot', slot === 'default' ? '' : slot);

  if (isPreview) {
    newElement.setAttribute('is-preview', '');
    newElement.setAttribute('webbit-id', 'preview');
  }

  return newElement;
}

export const addElement = (wom, element, targetedNode, placement) => {
  if (placement === 'inside') {
    wom.prependNode(element, targetedNode);
  } else if (placement === 'before') {
    wom.insertNodeBefore(element, targetedNode);
  } else {
    wom.insertNodeAfter(element, targetedNode);
  }
}