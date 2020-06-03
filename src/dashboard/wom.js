
const isWebbit = (domNode) => {
  if (!(domNode instanceof Object)) {
    return false;
  }

  return domNode.constructor.__WEBBIT_CLASSNAME__ === 'Webbit';
};

const getChildWebbits = (domNode) => {
  return [...domNode.children].filter(node => {
    return node.tagName.toLowerCase() !== 'wom-new-element-preview-display';
    return true;
    //return isWebbit(node);
  });
};


class WomNode {

  constructor(node, ancestors = []) {
    this.node = node;
    this.ancestors = ancestors;
    this.childNodes = [];
    this.slots = isWebbit(node) ? this.getMetadata().slots : ['default'];
    this.childBySlotNodes = this.slots.map(() => {
      return [];
    });

    this.onMouseEnter = () => {
      const event = new CustomEvent('womNodeMouseenter', {
        bubbles: true,
        composed: true,
        detail: {
          node: this,
        }
      });
      node.dispatchEvent(event);
    };

    this.onMouseLeave = () => {
      const event = new CustomEvent('womNodeMouseleave', {
        bubbles: true,
        composed: true,
        detail: {
          node: this
        }
      });
      node.dispatchEvent(event);
    };

    this.onMouseClick = (ev) => {
      ev.stopPropagation();
      const event = new CustomEvent('womNodeSelect', {
        bubbles: true,
        composed: true,
        detail: {
          node: this
        }
      });
      node.dispatchEvent(event);
    }

    node.addEventListener('mouseover', this.onMouseEnter);
    node.addEventListener('mouseleave', this.onMouseLeave);
    node.addEventListener('click', this.onMouseClick);
  }

  destroy() {
    this.node.removeEventListener('mouseover', this.onMouseEnter);
    this.node.removeEventListener('mouseleave', this.onMouseLeave);
    this.node.removeEventListener('click', this.onMouseClick);

    this.childNodes.forEach(node => {
      node.destroy();
    });
    this.childBySlotNodes = this.slots.map(() => {
      return [];
    });
  }

  build() {
    this.childNodes = getChildWebbits(this.node).map(node => {
      const womNode = new WomNode(node, this.ancestors.concat(this));
      const slot = womNode.getSlot();
      const indexOfSlot = this.slots.indexOf(slot);

      if (indexOfSlot > -1) {
        this.childBySlotNodes[indexOfSlot].push(womNode);
      }

      womNode.build();
      return womNode;
    });
  }

  isDescendant(node) {
    return this.ancestors.indexOf(node) >= 0;
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

  hasChildren() {
    return this.childNodes.length > 0;
  }

  getName() {
    return this.node.tagName.toLowerCase();
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
}


/**
 * Webbit Object Model (WOM)
 */
class Wom {

  constructor(rootNode) {
    this.rootNode = rootNode;
    this.womNode = new WomNode(this.rootNode);
    this.womNode.build();
  


    const observer = new MutationObserver((mutations) => {
      
      if (!this.hasNonPreviewChangeMutation(mutations)) {
        return;
      }

      this.womNode.destroy();
      this.womNode.build();
      const event = new CustomEvent('womChange', {
        bubbles: true,
        composed: true,
      });
      this.rootNode.dispatchEvent(event);
    });
    observer.observe(this.rootNode, {
      childList: true,
      subtree: true
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
}


export default Wom;