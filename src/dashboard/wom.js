import WomNode from './wom-node';
import { isElementInViewport } from './utils';
import { addInteraction, removeInteraction } from './interact';

class WomHistory {

  constructor() {
    this.history = [];
    this.position = -1;
  }

  storeLayout() {
    window.localStorage['savedWomLayout'] = this.getCurrentLayout();
  }

  getStoredLayout() {
    if ('savedWomLayout' in window.localStorage) {
      try {
        return window.localStorage['savedWomLayout'];
      } catch(e) {}
    }
    return null;
  }

  getCurrentPosition() {
    return this.position;
  }

  getHistoryLength() {
    return this.history.length;
  }

  getLayout(position) {
    return this.history[position];
  }

  getCurrentLayout() {
    return this.getLayout(this.position);
  }

  goBack() {
    if (!this.atBeginning()) {
      this.position--;
      this.storeLayout();
    }
  }

  atBeginning() {
    return this.position <= 0;
  }

  atEnd() {
    return this.position >= this.getHistoryLength() - 1;
  }

  goForward() {
    if (!this.atEnd()) {
      this.position++;
      this.storeLayout();
    }
  }

  push(layout) {

    if (layout === this.history[this.position]) {
      return;
    }

    this.history = this.history
      .slice(0, this.position + 1)
      .concat(layout);

    this.position = this.getHistoryLength() - 1;
    this.storeLayout();
  }
}

/**
 * Webbit Object Model (WOM)
 */
class Wom {

  constructor(rootNode) {
    this.rootNode = rootNode;
    this.dashboardElement = null;
    this.previewedNode = null;
    this.selectedNode = null;
    this.womNode = new WomNode(this.rootNode, this);
    this.actions = {};
    this.mode = 'live';
    this.observeMutations();
    this.history = new WomHistory();
    this.selectionEnabled = true;
    this.editingNodeHtml = false;
    this.clipboardNode = null;
  }

  async setClipboard(node) {
    this.clipboardNode = {
      html: await node.getHtml(true),
      componentType: node.getName(),
    };
    this.dispatchEvent('womClipboardSet');
  }

  getClipboard() {
    return this.clipboardNode;
  }

  setEditingNodeHtml(editing) {
    if (this.getSelectedNode() && this.editingNodeHtml !== editing) {
      this.editingNodeHtml = editing;
      this.dispatchEvent('womEditingNodeHtmlChange', { editing });
    }
  }

  isEditingNodeHtml() {
    return this.editingNodeHtml;
  }

  async getHtml() {
    return await this.womNode.getHtml();
  }

  setHtml(html) {
    this.womNode.setHtml(html);
  } 

  setDashboardElement(dashboardElement) {
    this.dashboardElement = dashboardElement;
  }

  build() {
    this.womNode.destroy();
    this.womNode.build();
    this.dispatchEvent('womChange');
  }

  previewNode(node) {
    this.removeNodePreview();
    this.previewedNode = node;
    this.dispatchEvent('womNodePreview', { node });
  }

  removeNodePreview() {
    if (this.previewedNode) {
      const previewedNode = this.previewedNode;
      this.previewedNode = null;
      this.dispatchEvent('womNodePreviewRemove', { node: previewedNode });
    }
  }

  getPreviewedNode() {
    return this.previewedNode;
  }

  selectNode(node) {
    this.deselectNode();
    this.selectedNode = node;
    if (node.getNode() !== this.rootNode && node.getParent().getLayout() === 'absolute') {
      addInteraction(this, node);
      node.getNode().classList.add("draggable");
    }
    this.dispatchEvent('womNodeSelect', { node });
  }

  deselectNode() {
    if (this.getSelectedNode()) {
      removeInteraction(this.getSelectedNode());
      this.setEditingNodeHtml(false);
      this.getSelectedNode().getNode().classList.remove("draggable");
      const deselectedNode = this.selectedNode;
      this.selectedNode = null;
      this.dispatchEvent('womNodeDeselect', { node: deselectedNode });
    }
  }

  getSelectedNode() {
    return this.selectedNode ? this.selectedNode.getNode().__WOM_NODE__ : null;
  }

  addAction(id, action) {
    this.actions[id] = action;
  }

  getAction(id) {
    return this.actions[id];
  }

  getActionIds() {
    return Object.keys(this.actions);
  }

  executeAction(actionId, context) {

    const action = this.getAction(actionId);
    const selectedNode = this.getSelectedNode();

    if (!action || action.needsSelection && !selectedNode) {
      return;
    }

    action.execute({
      wom: this,
      selectedNode,
      context: context || {},
    });
    this.dispatchEvent('womActionExecute', {
      actionId,
      action
    })
  }

  removeNode(node) {
    node.getNode().remove();
    this.dispatchEvent('womNodeRemove', { node });
  }

  setMode(mode) {
    if (this.mode !== mode) {
      this.mode = mode;
      this.dispatchEvent('womModeChange', { mode });
    }
  }

  getMode() {
    return this.mode;
  }


  addListener(eventName, callback) {
    this.rootNode.addEventListener(eventName, callback);
  }

  addListenerOnce(eventName, callback) {
    const listener = (...args) => {
      callback(...args);
      this.removeListener(eventName, listener);
    };
    this.addListener(eventName, listener);
  }

  removeListener(eventName, callback) {
    this.rootNode.removeEventListener(eventName, callback);
  }

  observeMutations() {
    const observer = new MutationObserver((mutations) => { 
      this.build();
    });
    observer.observe(this.rootNode, {
      childList: true,
      subtree: true,
      attributeFilter: ['webbit-id']
    });
  }

  getRootNode() {
    return this.womNode;
  }

  getDashboardElement() {
    return this.dashboardElement;
  }

  destroy() {
    this.deselectNode();
    this.womNode.destroy();
  }

  dispatchEvent(name, detail) {
    const event = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail
    });

    this.rootNode.dispatchEvent(event);
  }

  toggleSelectionTool() {
    this.selectionEnabled = !this.selectionEnabled;
    this.dispatchEvent('selectionToolToggle');
  }

  isSelectionEnabled() {
    return this.selectionEnabled;
  }
}

export default Wom;