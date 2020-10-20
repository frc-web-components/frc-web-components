import Action from '../action';

export default class PasteNode extends Action {

  get needsSelection() {
    return true;
  }

  execute({ wom, selectedNode }) {
    const clipboard = wom.getClipboard();

    if (clipboard === null) {
      return;
    }

    const { html, componentType } = clipboard;

    if (!selectedNode.canContainComponent(componentType)) {
      return;
    }

    const tempElement = window.document.createElement('div');
    tempElement.innerHTML = html;

    if (tempElement.children.length !== 1) {
      return;
    }

    const newElement = tempElement.children[0];
    newElement.style.transform = 'initial';
    newElement.removeAttribute('data-x');
    newElement.removeAttribute('data-y');

    wom.addListenerOnce('womChange', async () => {
      wom.history.push(await wom.getHtml());
    });

    selectedNode.getNode().append(newElement);
  };
}