import WomNode from './wom-node';
import { isElementInViewport } from './utils';


/**
 * Webbit Object Model (WOM)
 */
class Wom {

  constructor(rootNode) {
    this.rootNode = rootNode;
    this.selectedNode = null;
    this.womNode = new WomNode(this.rootNode);
    this.womNode.build();
    this.actions = {};
    this.selectedActionId = null;
    this.actionContext = {};
    this.mode = 'live';
    this.observeMutations();
  }

  selectNode(node) {
    this.deselectNode();
    this.selectedNode = node;
    this.dispatchEvent('womNodeSelect', { node });
  }

  deselectNode() {
    this.deselectAction();
    if (this.selectedNode) {
      const deselectedNode = this.selectedNode;
      this.selectedNode = null;
      this.dispatchEvent('womNodeDeselect', { node: deselectedNode });
    }
  }

  getSelectedNode() {
    return this.selectedNode;
  }

  targetNode(node) {
    if (this.getSelectedAction()) {
      this.dispatchAction('womNodeTarget', { node });
      this.executeAction(node);
    }
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

  selectAction(id, context) {

    const action = this.getAction(id);

    if (!action) {
      return;
    }

    this.deselectAction();
    if (this.getSelectedNode() || !action.needsSelection) {
      this.selectedActionId = id;
      this.dispatchEvent('womActionSelect', { 
        actionId,
        action: this.getAction(id)
      });
      this.setActionContext(context);
      this.executeAction();
    }
  }

  deselectAction() {
    const prevSelectedActionId = this.getSelectedActionId();
    if (prevSelectedActionId) {
      this.selectedActionId = null;
      this.actionContext = {};
      this.dispatchEvent('womActionDeselect', { 
        actionId: prevSelectedActionId,
        action: this.getAction(prevSelectedActionId)
      });
    }
  }

  getSelectedActionId() {
    return this.selectedActionId;
  }

  executeAction(targetedNode) {

    const actionId = this.getSelectedActionId();
    const action = this.getAction(actionId);
    const selectedNode = this.getSelectedNode();

    if (!actionId || !action.isReady(!!selectedNode, !!targetedNode)) {
      return;
    }

    action.execute({
      wom: this,
      selectedNode,
      targetedNode,
      context: this.getActionContext(),
    });
    this.dispatchEvent('womActionExecute', {
      actionId,
      action
    })
  }

  setActionContext(context) {

    const actionId = this.getSelectedActionId();
    const action = this.getAction(actionId);

    if (!action) {
      return;
    }

    this.actionContext = {
      ...this.actionContext,
      context
    };
    this.dispatchEvent('womActionContextSet', {
      actionId,
      action,
      actionContext: this.actionContext
    });
  }

  getActionContext() {
    return this.actionContext;
  }

  prependNode(node, parentNode) {
    parentNode.getNode().prepend(node);

    // scroll inserted node into view
    if (!isElementInViewport(node, this.rootNode)) {
      node.scrollIntoView();
    }

    this.dispatchEvent('womNodeAdd', { node });
  }

  insertNodeAfter(node, adjacentNode) {
    adjacentNode.getNode().parentNode.insertBefore(
      node, 
      adjacentNode.getNode()
    );

    // scroll inserted node into view
    if (!isElementInViewport(node, this.rootNode)) {
      node.scrollIntoView();
    }

    this.dispatchEvent('womNodeAdd', { node });
  }

  insertNodeBefore(node, adjacentNode) {

    adjacentNode.getNode().parentNode.insertBefore(
      node, 
      adjacentNode.getNode().nextSibling
    );
    
    // scroll inserted node into view
    if (!isElementInViewport(node, this.rootNode)) {
      node.scrollIntoView();
    }

    this.dispatchEvent('womNodeAdd', { node });
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

  save() {

  }

  load(config) {

  }

  addListener(eventName, callback) {
    this.rootNode.addEventListener(eventName, callback);
  }

  observeMutations() {
    const observer = new MutationObserver((mutations) => {
      
      if (!this.hasNonPreviewChangeMutation(mutations)) {
        return;
      }

      this.womNode.destroy();
      this.womNode.build();
      this.dispatchEvent('womChange');
    });
    observer.observe(this.rootNode, {
      childList: true,
      subtree: true,
      attributeFilter: ['webbit-id']
    });
  }

  hasNonPreviewChangeMutation(mutations) {
    for (let mutation of mutations) {
      const [addedNode] = mutation.addedNodes;
      const [removedNode] = mutation.removedNodes;
      const node = addedNode || removedNode;

      if (!node) {
        return true;
      }

      const tagName = (node.tagName || '').toLowerCase();

      if (tagName !== 'wom-new-element-preview-display') {
        return true;
      }
    }

    return false;
  }

  getRootNode() {
    return this.womNode;
  }

  destroy() {
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
}


export default Wom;