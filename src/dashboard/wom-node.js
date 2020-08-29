
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

    this.onMouseEnter = () => {
      if (
        !this.wom.getPreviewedNode() 
        || this.getLevel() >= this.wom.getPreviewedNode().getLevel()
      ) {
        this.wom.previewNode(this);
      }
    };

    this.onMouseLeave = () => {
      if (this.wom.getPreviewedNode().getWebbitId() === this.getWebbitId()) {
        this.wom.removeNodePreview();
      }
    };

    this.onMouseClick = (ev) => {

      const { targetedNode } = this.wom.getActionContext();

      if (this.wom.getSelectedActionId() === 'addNode') {
        if (targetedNode) {
          this.wom.targetNode(targetedNode);
        }
      } else if (this.ancestors.length > 0) {
        this.wom.selectNode(this);
      }
    }

    this.onMouseMove = (ev) => {

      if (this.wom.getSelectedActionId() !== 'addNode') {
        return;
      }

      if (this.getLevel() === 0 && !this.wom.getPreviewedNode()) {
        this.wom.previewNode(this);
      }

      if (!this.wom.getPreviewedNode() || (this.wom.getPreviewedNode().getWebbitId() !== this.getWebbitId())) {
        return;
      }

      const { mousePosition } = this.wom.getActionContext();

      const mouseX = ev.clientX;
      const mouseY = ev.clientY;

      if (mousePosition) {
        const { x, y } = mousePosition;
        const xDistance = mouseX - x;
        const yDistance = mouseY - y;
        const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

        if (distance < 50) {
          console.log('less than distance');
          return;
        }
      }

      const target = this.node;
      const boundingRect = target.getBoundingClientRect();
      const offsetX = boundingRect.x;
      const offsetY = boundingRect.y;
      const width = target.clientWidth;
      const height = target.clientHeight;
      var xPos = Math.abs(offsetX - mouseX);
      var yPos = Math.abs(offsetY - mouseY);

      let placement = null;

      if (this.getLevel() === 0) {
        placement = 'inside';
      } else if (
        xPos > width * .4
        && xPos < width * .6
        && yPos > height * .4
        && yPos < height * .6
      ) {
        placement = 'inside';
      } else if (
        (yPos < height * .8 && xPos < 40) ||
        (xPos < width * .8 && yPos < 40)
      ) {
        placement = 'before';
      } else if (
        (yPos > height * .2 && xPos > width - 40) ||
        (xPos > width * .2 && yPos > height - 40)
      ) {
        placement = 'after';
      }

      console.log('placement:', placement, this.getWebbitId());
      

      if (
        !placement || 
        (placement === 'inside' && this.getChildren().length > 0)
      ) {
        return;
      }

      this.wom.setActionContext(this.wom.getSelectedActionId(), {
        placement,
        slot: placement === 'inside' ? 'default' : this.getSlot(),
        targetedNode: this,
        mousePosition: {
          x: mouseX,
          y: mouseY
        }
      });

      console.log('placement:', placement);
    };

    node.addEventListener('mousemove', this.onMouseMove);
    node.addEventListener('mouseover', this.onMouseEnter);
    node.addEventListener('mouseleave', this.onMouseLeave);
    node.addEventListener('click', this.onMouseClick);
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
    if (this.getLevel() > 0) {
      this.node.removeEventListener('mouseover', this.onMouseEnter);
      this.node.removeEventListener('mouseleave', this.onMouseLeave);
      this.node.removeEventListener('click', this.onMouseClick);
    }

    this.childNodes.forEach(node => {
      node.destroy();
    });
    this.childBySlotNodes = this.slots.map(() => {
      return [];
    });
    this.wom.dispatchEvent('womNodeDestroy', { node: this });
  }

  getJson() {
    return {
      name: this.getName(),
      slot: this.node.getAttribute('slot') || '',
      webbit: {
        isWebbit: this.isWebbit(),
        id: this.getWebbitId(),
        sourceProvider: this.getSourceProvider(),
        sourceKey: this.getSourceKey(),
        properties: this.getDefaultProps(),
      },
      children: this.getChildren().map(node => node.getJson())
    };
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
}