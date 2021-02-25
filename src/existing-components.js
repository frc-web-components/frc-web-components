
const { 
  isInstanceOfWebbit, 
  whenAnyDefined, 
  getDashboardConfig, 
  getWebbit, 
  _generateWebbitId, 
  addExisting,
  getRegisteredNames,
  get,
} = window.webbitRegistry;


addExisting('a', {
  displayName: 'Link',
  category: 'HTML Elements',
});

export class ManageExistingComponents {


  constructor() {

    // map from html element to config
    this.elements = new Map();
    this.elementTypes = [];
    
    getRegisteredNames().filter(name => {
      if (!isInstanceOfWebbit(get(name))) {
        this.addElementType(name);
      }
    });

    whenAnyDefined(name => {
      if (!isInstanceOfWebbit(get(name))) {
        this.addElementType(name);
      }
    });

    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          const addedNodes = mutation.addedNodes || [];
          const removedNodes = mutation.removedNodes || [];
          // console.log('mutation:', mutation);
          addedNodes.forEach(node => {
            if (this.isElementType(node.nodeName.toLowerCase())) {
              this.addElement(node);
            }
            if ('querySelectorAll' in node) {
              this.elementTypes.forEach(name => {
                node.querySelectorAll(name).forEach(element => {
                  this.addElement(element);
                });
              });
            }
          });
          removedNodes.forEach(node => {
            if (this.isElementType(node.nodeName.toLowerCase())) {
              this.removeElement(node);
            }
            if ('querySelectorAll' in node) {
              this.elementTypes.forEach(name => {
                node.querySelectorAll(name).forEach(element => {
                  this.removeElement(element);
                });
              });
            }
          });
          // console.log('mutation:', mutation);
        }
      }
    });
    observer.observe(window.document.body, {
      childList: true,
      subtree: true,
    });

    

  }

  isElementType(name) {
    return this.elementTypes.indexOf(name) > -1;
  }

  addElementType(name) {
    this.elementTypes.push(name);
    document.body.querySelectorAll(name).forEach(element => {
      this.addElement(element);
    });
  }

  addElement(element) {
    this.elements.set(element, { a : 1 });
    console.log('elements:', this.elements);

    // check to see if there's a config for this element and it's not a webbit

    // observe changes to this element so it can be updated
  }

  removeElement(element) {
    this.elements.delete(element);
    console.log('elements:', this.elements);
  }

  subscribe(element, sourceProvider, sourceKey) {

  }

  unsubscribe(element) {

  }

  mapAttributeToProp(element, attribute, value) {

  }

  mapPropToAttribute(element, prop, value) {

  }
}

const manageExistingComponents = new ManageExistingComponents();


addExisting('img', {
  displayName: 'Image',
  category: 'HTML Elements',
});