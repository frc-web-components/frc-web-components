import WomNode from './wom-node';
import { isElementInViewport } from './utils';

class WomHistory {

  constructor() {
    this.history = [];
    this.position = -1;
  }

  storeLayout() {
    window.localStorage['currentWomLayout'] = this.getCurrentLayout();
  }

  getStoredLayout() {
    if ('currentWomLayout' in window.localStorage) {
      try {
        return window.localStorage['currentWomLayout'];
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
    this.selectedActionId = null;
    this.actionContext = {};
    this.mode = 'live';
    this.observeMutations();
    this.history = new WomHistory();
  }

  getHtml() {
    return this.womNode.getHtml();
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
      action.select({ 
        wom: this,
        context: { ...context }
      });
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

  executeAction() {

    const actionId = this.getSelectedActionId();
    const action = this.getAction(actionId);
    const selectedNode = this.getSelectedNode();

    if (!actionId || !action.isReady(!!selectedNode)) {
      return;
    }

    action.execute({
      wom: this,
      selectedNode,
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