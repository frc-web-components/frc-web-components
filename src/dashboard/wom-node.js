
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

const getPositionInNode = (node, x, y) => {
  const { 
    left, 
    right, 
    top, 
    bottom, 
    width, 
    height 
  } = node.getBoundingClientRect();

  const yThreshhold = bottom - (x - left) * height / width;

  if (y < yThreshhold) {
    return {
      placement: 'start',
      distance: Math.min(x - left, y - top)
    };
  } else {
    return {
      placement: 'end',
      distance: Math.min(right - x, bottom - y)
    };
  }
}

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const getDistanceFromNode = (node, x, y) => {
  const { 
    left, 
    right, 
    top, 
    bottom, 
  } = node.getBoundingClientRect();

  let distance = 0;
  let placement = null;

  if (x < left && y < top) {
    distance = getDistance(x, y, left, top);
    placement = (left - x) > (top - y) ? 'left' : 'top';
  } else if (x > left && x < right && y < top) {
    distance = top - y;
    placement = 'top';
  } else if (x > right && y < top) {
    distance = getDistance(x, y, right, top);
    placement = (x - right) > (top - y) ? 'right' : 'top';
  } else if (x > right && y > top && y < bottom) {
    distance = x - right;
    placement = 'right';
  } else if (x > right && y > bottom) {
    distance = getDistance(x, y, right, bottom);
    placement = (x - right) > (y - bottom) ? 'right' : 'bottom';
  } else if (x > left && x < right && y > bottom) {
    distance = y - bottom;
    placement = 'bottom';
  } else if (x < left && y > bottom) {
    distance = getDistance(x, y, left, bottom);
    placement = (left - x) > (y - bottom) ? 'left' : 'bottom';
  } else if (x < left && y > top && y < bottom) {
    distance = left - x;
    placement = 'left';
  }
  return { distance, placement };
}


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

    this.onMouseEnter = () => {
      this.onEnter();
    };

    this.onMouseLeave = () => {
      this.onLeave();
    };

    this.onMouseClick = (ev) => {
      ev.stopPropagation();

      const { width, height } = this.wom.getDashboardElement().getBoundingClientRect();
      const { clientX, clientY } = ev;

      if ((clientX > width || clientY > height)) {
        return;
      }

      this.wom.selectNode(this);
    }

    node.addEventListener('mouseover', this.onMouseEnter);
    node.addEventListener('mouseleave', this.onMouseLeave);
    node.addEventListener('click', this.onMouseClick);
  }

  onMove(ev) {

    if (this.wom.getSelectedActionId() !== 'addNode') {
      return;
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

      if (distance < 20) {
        return;
      }
    }

    const closestNode = this
      .getChildren()
      .map(node => ({
        node,
        ...getDistanceFromNode(node.getNode(), mouseX, mouseY)
      }))
      .reduce((closest, nodeDistance) => {
        if (!closest) {
          return nodeDistance;
        }
        return closest.distance < nodeDistance.distance ? closest : nodeDistance;
      }, null);
      
    const parentDistance = getPositionInNode(this.getNode(), mouseX, mouseY);

    const closestTo = {
      node: null,
      isParent: false,
      placement: ''
    };

    if (!closestNode) {
      closestTo.node = this;
      closestTo.isParent = true;
      closestTo.placement = parentDistance.placement;
    } else {
      closestTo.node = closestNode.node;
      closestTo.placement = closestNode.placement;
    }


    this.wom.setActionContext(this.wom.getSelectedActionId(), {
      targetedNode: this,
      dragAndDrop: true,
      slot: this.getSlot(),
      parentNode: this,
      mousePosition: {
        x: mouseX,
        y: mouseY
      },
      closestTo
    });

    // const target = this.node;
    // const boundingRect = target.getBoundingClientRect();
    // const offsetX = boundingRect.x;
    // const offsetY = boundingRect.y;
    // const width = target.clientWidth;
    // const height = target.clientHeight;
    // var xPos = Math.abs(offsetX - mouseX);
    // var yPos = Math.abs(offsetY - mouseY);

    // let placement = null;

    // if (this.getLevel() === 0) {
    //   placement = 'inside';
    // } else if (
    //   xPos > width * .25
    //   && xPos < width * .75
    //   && yPos > height * .25
    //   && yPos < height * .75
    // ) {
    //   placement = 'inside';
    // } else if (
    //   (yPos < height * .8 && xPos < 40) ||
    //   (xPos < width * .8 && yPos < 40)
    // ) {
    //   placement = 'before';
    // } else if (
    //   (yPos > height * .2 && xPos > width - 40) ||
    //   (xPos > width * .2 && yPos > height - 40)
    // ) {
    //   placement = 'after';
    // }     
    
    // if (!placement) {
    //   return;
    // }

    // if (placement === 'inside') {
    //   if (this.getChildren().length > 0 || this.slots.length === 0) {
    //     return;
    //   }

    //   const { componentType } = this.wom.getActionContext();
    //   const { allowedParents } = webbitRegistry.getMetadata(componentType) || {};
    //   const { allowedChildren } = this.getMetadata() || {};

    //   if (allowedChildren && allowedChildren.indexOf(componentType) < 0) {
    //     return;
    //   }

    //   if (allowedParents && allowedParents.indexOf(this.getName()) < 0) {
    //     return;
    //   }

    // } else if (placement === 'before' || placement === 'after') {
    //   const parent = this.getParent();

    //   if (!parent) {
    //     return;
    //   }

    //   const { componentType } = this.wom.getActionContext();
    //   const { allowedParents } = webbitRegistry.getMetadata(componentType) || {};
    //   const { allowedChildren } = parent.getMetadata() || {};

    //   if (allowedChildren && allowedChildren.indexOf(componentType) < 0) {
    //     return;
    //   }

    //   if (allowedParents && allowedParents.indexOf(parent.getName()) < 0) {
    //     return;
    //   }
    // }
    
    // this.wom.setActionContext(this.wom.getSelectedActionId(), {
    //   placement,
    //   slot: placement === 'inside' ? 'default' : this.getSlot(),
    //   targetedNode: this,
    //   mousePosition: {
    //     x: mouseX,
    //     y: mouseY
    //   },
    // });
  }

  onAdd() {
    const { targetedNode } = this.wom.getActionContext();
    if (targetedNode) {
      this.wom.targetNode(targetedNode);
    }
  }

  onEnter() {

    if (
      !this.wom.getPreviewedNode() 
      || this.getLevel() >= this.wom.getPreviewedNode().getLevel()
    ) {

      if (this.slots.length === 0) {
        return;
      }

      const { componentType } = this.wom.getActionContext();
      const { allowedParents } = webbitRegistry.getMetadata(componentType) || {};
      const { allowedChildren } = this.getMetadata() || {};
      
      if (allowedChildren && allowedChildren.indexOf(componentType) < 0) {
        return;
      }


      if (allowedParents && allowedParents.indexOf(this.getName()) < 0) {
        return;
      }

      this.wom.previewNode(this);
    }
  }

  onLeave() {
    if (this.wom.getPreviewedNode() && this.wom.getPreviewedNode().getWebbitId() === this.getWebbitId()) {
      this.wom.removeNodePreview();
    }
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

  placeLayoutElement(element, context) {
    const { 
      closestTo: { node, isParent, placement }
    } = context;

    if (isParent) {
      if (placement === 'start') {
        node.prepend(element);
      } else  {
        node.append(element);
      }
    } else {
      if (placement === 'left' || placement === 'top') {
        this.getNode().insertBefore(
          element, 
          node
        );
      } else {
        this.getNode().insertBefore(
          element, 
          node.nextSibling
        );
      }
    }
    // if (!isWebbit(this.getNode())) {

    // } else {
    //   this.getNode().placeLayoutElement(element, context);
    // }
  }
}