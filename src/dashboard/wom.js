import WomNode from './wom-node';
import { isElementInViewport } from './utils';


/**
 * Webbit Object Model (WOM)
 */
class Wom {

  constructor(rootNode, dashboardElement) {
    this.rootNode = rootNode;
    this.dashboardElement = dashboardElement;
    this.previewedNode = null;
    this.selectedNode = null;
    this.womNode = new WomNode(this.rootNode, this);
    this.womNode.build();
    this.actions = {};
    this.selectedActionId = null;
    this.actionContext = {};
    this.mode = 'live';
    this.observeMutations();
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

    if (node.getNode() === this.rootNode) {
      return;
    }

    this.deselectNode();
    this.selectedNode = node;
    this.dispatchEvent('womNodeSelect', { node });
  }

  deselectNode() {
    this.deselectAction();
    if (this.getSelectedNode()) {
      const deselectedNode = this.selectedNode;
      this.selectedNode = null;
      this.dispatchEvent('womNodeDeselect', { node: deselectedNode });
    }
  }

  getSelectedNode() {
    return this.selectedNode ? this.selectedNode.getNode().__WOM_NODE__ : null;
  }

  targetNode(node) {
    const action = this.getAction(this.getSelectedActionId());
    if (action) {
      this.dispatchEvent('womNodeTarget', { node });
      this.executeAction(node);
    }
  }

  interactWithNode(node) {
    const action = this.getAction(this.getSelectedActionId());
    if (action) {
      this.targetNode(node);
    } else {
      this.selectNode(node);
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
        actionId: id,
        action: this.getAction(id)
      });
      this.setActionContext(id, context);
      this.executeAction();
    }
  }

  deselectAction() {
    const prevSelectedActionId = this.getSelectedActionId();
    if (prevSelectedActionId) {
      const action = this.getAction(prevSelectedActionId);
      this.selectedActionId = null;
      action.deselect({
        wom: this,
        selectedNode: this.getSelectedNode(),
        context: this.getActionContext(),
      });
      this.actionContext = {};

      this.dispatchEvent('womActionDeselect', { 
        actionId: prevSelectedActionId,
        action
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

  setActionContext(id, context) {

    const actionId = this.getSelectedActionId();
    const action = this.getAction(actionId);

    if (!action || id !== actionId) {
      return;
    }

    this.actionContext = {
      ...this.actionContext,
      ...context
    };

    action.contextChange({
      wom: this,
      selectedNode: this.getSelectedNode(),
      context: this.actionContext,
    });

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
    if (!isElementInViewport(node, this.dashboardElement)) {
      node.scrollIntoView();
    }

    this.dispatchEvent('womNodeAdd', { node });
  }

  insertNodeAfter(node, adjacentNode) {
    adjacentNode.getNode().parentNode.insertBefore(
      node, 
      adjacentNode.getNode().nextSibling
    );

    // scroll inserted node into view
    if (!isElementInViewport(node, this.dashboardElement)) {
      node.scrollIntoView();
    }

    this.dispatchEvent('womNodeAdd', { node });
  }

  insertNodeBefore(node, adjacentNode) {

    adjacentNode.getNode().parentNode.insertBefore(
      node, 
      adjacentNode.getNode()
    );
    
    // scroll inserted node into view
    if (!isElementInViewport(node, this.dashboardElement)) {
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

  removeListener(eventName, callback) {
    this.rootNode.removeEventListener(eventName, callback);
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

      if (!node || !node.hasAttribute('is-preview')) {
        return true;
      }
    }

    return false;
  }

  getRootNode() {
    return this.womNode;
  }

  getDashboardElement() {
    return this.dashboardElement;
  }

  destroy() {
    this.deselectAction();
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
}


export default Wom;