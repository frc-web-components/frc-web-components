import Action from '../action';

export default class AddNode extends Action {

  constructor() {
    super({
      needsTarget: true
    });
  }

  execute({ 
    wom, 
    targetedNode,
    context
  }) {
    const { placement, componentType, slot } = context;

    const parentNode = document.createElement('div');
    parentNode.innerHTML = `
      <${componentType}></${componentType}>
    `
    const newElement = parentNode.querySelector(componentType);
    newElement.setAttribute('slot', slot === 'default' ? '' : slot);

    if (placement === 'inside') {
      wom.prependNode(newElement, targetedNode);
    } else if (placement === 'before') {
      wom.insertNodeBefore(newElement, targetedNode);
    } else {
      wom.insertNodeAfter(newElement, targetedNode);
    }
  }
}