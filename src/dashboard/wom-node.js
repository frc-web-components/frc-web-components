import { FlowLayout } from '@webbitjs/webbit';

const isWebbit = (domNode) => {
  if (!(domNode instanceof Object)) {
    return false;
  }

  return domNode.constructor.__WEBBIT_CLASSNAME__ === 'Webbit';
};

const getChildWebbits = (domNode) => {
  return [...domNode.children].filter(node => {
    return !node.hasAttribute('is-preview');
    return true;
    //return isWebbit(node);
  });
};

export default class WomNode {

  constructor(node, wom, ancestors = []) {
    this.node = node;
    this.node.__WOM_NODE__ = this;
    this.wom = wom;
    this.ancestors = ancestors;
    this.childNodes = [];
    this.slots = isWebbit(node) ? this.getMetadata().slots : ['default'];
    this.childBySlotNodes = this.slots.map(() => {
      return [];
    });

    if (!this.node.webbitId) {
      this.node.webbitId = webbitRegistry._generateWebbitId(this.node);
    }

    this.selectionBox = null;
  }

  canContainComponent(componentType) {

    if (this.slots.length === 0) {
      return false;
    }

    const { allowedParents } = webbitRegistry.getMetadata(componentType) || {};
    const { allowedChildren } = this.getMetadata() || {};
    
    if (allowedChildren && allowedChildren.indexOf(componentType) < 0) {
      return false;
    }

    if (allowedParents && allowedParents.indexOf(this.getName()) < 0) {
      return false;
    }

    return true;
  }

  async getHtml(outer) {
    return new Promise(resolve => {
      window.webbitRegistry.setCloning(true);
      const clonedNode = this.node.cloneNode(true);
      document.body.append(clonedNode);
      [...clonedNode.querySelectorAll('[webbit-id]'), clonedNode].forEach(node => {
        if (!isWebbit(node)) {
          return;
        }
        node.isClone = true;
        const originalWebbit = window.webbitRegistry.getWebbit(node.webbitId);

        Object.entries(originalWebbit.defaultProps).forEach(([prop, value]) => {
          node[prop] = value;
        });
      });
      window.webbitRegistry.setCloning(false);
      clonedNode.remove();
      setTimeout(() => {
        resolve(outer ? clonedNode.outerHTML : clonedNode.innerHTML);
      });
    });
  }

  setHtml(html) {
    this.node.innerHTML = html;
  }

  getParent() {
    const parentNode = this.ancestors[this.ancestors.length - 1];
    return parentNode || null;
  }

  getNextSibling() {
    const parentNode = this.getParent();
    if (!parentNode) {
      return null;
    }
    const siblings = parentNode.getChildren(this.getSlot());
    const siblingIndex = siblings
      .findIndex(sibling => sibling.getNode() === this.getNode()) + 1;

    return siblings[siblingIndex] || null;
  }

  getPreviousSibling() {
    const parentNode = this.getParent();
    if (!parentNode) {
      return null;
    }
    const siblings = parentNode.getChildren(this.getSlot());
    const siblingIndex = siblings
      .findIndex(sibling => sibling.getNode() === this.getNode()) - 1;

    return siblings[siblingIndex] || null;
  }

  destroy() {
    this.childNodes.forEach(node => {
      node.destroy();
    });
    this.childBySlotNodes = this.slots.map(() => {
      return [];
    });
    this.wom.dispatchEvent('womNodeDestroy', { node: this });
  }

  build() {
    this.childNodes = getChildWebbits(this.node).map(node => {
      const womNode = new WomNode(node, this.wom, this.ancestors.concat(this));
      const slot = womNode.getSlot();
      const indexOfSlot = this.slots.indexOf(slot);

      if (indexOfSlot > -1) {
        this.childBySlotNodes[indexOfSlot].push(womNode);
      }

      womNode.build();
      return womNode;
    });
    this.wom.dispatchEvent('womNodeBuild', { node: this });
  }

  isDescendant(node) {
    return this.ancestors.map(ancestor => ancestor.node).indexOf(node.node) >= 0;
  }

  getSlots() {
    return this.slots;
  }

  getChildrenBySlot(slot) {
    const indexOfSlot = this.slots.indexOf(slot);
    return this.childBySlotNodes[indexOfSlot] || [];
  }

  getSlot() {
    return this.node.getAttribute('slot') || 'default';
  }

  getChildren() {
    return this.childNodes;
  }

  getDescendents() {
    let descendents = [];
    this.getChildren().forEach(child => {
      descendents.push(child);
      descendents = descendents.concat(child.getDescendents());
    });
    return descendents;
  }

  hasChildren() {
    return this.childNodes.length > 0;
  }

  getName() {
    return this.node.tagName.toLowerCase();
  }

  getDisplayName() {
    const metadata = this.getMetadata();
    return metadata ? metadata.displayName : this.getName();
  }

  getLayout() {
    const metadata = this.getMetadata();
    return metadata ? metadata.layout : 'absolute';
  }

  getWebbitId() {
    return this.node.webbitId;
  }

  getSourceProvider() {
    return isWebbit(this.node) ? this.node.sourceProvider : null;
  }

  getSourceKey() {
    return isWebbit(this.node) ? this.node.sourceKey : null;
  }

  getDefaultProps() {
    return isWebbit(this.node) ? this.node.defaultProps : {};
  }

  getMetadata() {
    return webbitRegistry.getMetadata(this.getName());
  }

  isRoot() {
    return this.level === 0;
  }

  getNode() {
    return this.node;
  }

  getLevel() {
    return this.ancestors.length;
  }

  isWebbit() {
    return isWebbit(this.node);
  }

  setSelectionBox(box) {
    this.selectionBox = box;
  }

  getSelectionBox() {
    return this.selectionBox;
  }
}