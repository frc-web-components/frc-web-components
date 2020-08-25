import Action from '../action';
import { addElement, loadLayout } from './utils';

export default class CutNode extends Action {

  constructor() {
    super({
      needsSelection: true,
      needsTarget: true
    });

    this.previewedNode = null;
    this.layoutJsonBeforeCut = null;
  }

  removePreviewedNode(wom) {
    if (this.previewedNode) {
      this.previewedNode.remove();
      wom.dispatchEvent('womPreviewNodeRemove', { node: this.previewNode });
    }
  }

  deselect({ wom }) {
    if (this.layoutJsonBeforeCut) {
      this.removePreviewedNode(wom);
      loadLayout(wom, this.layoutJsonBeforeCut);
    }
  }

  contextChange({ wom, selectedNode, context }) {
    this.layoutJsonBeforeCut = wom.history.getCurrentLayout();
    selectedNode.getNode().remove();
    this.removePreviewedNode(wom);

    const { placement, targetedNode, slot } = context;

    if (targetedNode) {
      this.createPreviewedNode(selectedNode.getNode(), slot);
      addElement(wom, this.previewedNode, targetedNode.getNode(), placement);
      wom.dispatchEvent('womPreviewNodeAdd', { node: this.previewedNode });
    }
  }

  createPreviewedNode(node, slot) {
    this.previewedNode = node.cloneNode(true);
    this.previewedNode.setAttribute('is-preview', '');
    this.previewedNode.setAttribute('webbit-id', 'preview');
    this.previewedNode.setAttribute('slot', slot === 'default' ? '' : slot);
  }

  execute({ wom, selectedNode, targetedNode, context }) {
    this.removePreviewedNode(wom);
    const { placement, slot } = context;

    wom.addListenerOnce('womChange', () => {
      wom.history.push(wom.getJson());
      wom.deselectNode();
    });

    this.previewedNode.removeAttribute('is-preview');
    this.previewedNode.setAttribute('webbit-id', selectedNode.getWebbitId());
    addElement(wom, this.previewedNode, targetedNode.getNode(), placement);
    this.layoutJsonBeforeCut = null;
  }
}