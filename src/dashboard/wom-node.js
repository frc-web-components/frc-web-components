
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


export default class WomNode {

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

  dispatchWomNodeBuild() {
    const event = new CustomEvent('womNodeBuild', {
      detail: {
        node: this
      }
    });
    this.node.dispatchEvent(event);
  }

  dispatchWomNodeDestroy() {
    const event = new CustomEvent('womNodeDestroy', {
      detail: {
        node: this
      }
    });
    this.node.dispatchEvent(event);
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
    this.dispatchWomNodeDestroy();
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
    this.dispatchWomNodeBuild();
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

  getWebbitId() {
    return isWebbit(this.node) ? this.node.webbitId : null;
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