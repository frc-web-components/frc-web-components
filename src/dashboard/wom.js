
const isWebbit = (domNode) => {
  if (!(domNode instanceof Object)) {
    return false;
  }

  return domNode.constructor.__WEBBIT_CLASSNAME__ === 'Webbit';
};

const getChildWebbits = (domNode) => {
  return [...domNode.children].filter(node => {
    return isWebbit(node);
  });
};


class WomNode {

  constructor(node, root = false) {
    this.node = node;
    this.root = root;
    this.childNodes = [];
  }

  build() {
    this.childNodes = getChildWebbits(this.node).map(node => {
      const womNode = new WomNode(node);
      womNode.build();
      return womNode;
    });
  }
}


/**
 * Webbit Object Model (WOM)
 */
class Wom {


  constructor(rootNode) {
    this.rootNode = rootNode;
    this.womNode = new WomNode(this.rootNode, true);
    this.womNode.build();


    const observer = new MutationObserver(() => {
      this.womNode.build();
    });
    observer.observe(this.rootNode, {
      childList: true,
      subtree: true
    });
  }
}


export default Wom;