
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
  description: 'description',
  // slots: ['default', 'b'],
  properties: {
    href: { type: String },
  }
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

    element.webbitPropertyValues = {

    };

    this.elements.set(element, { a : 1 });
    console.log('elements:', this.elements);

    // check to see if there's a config for this element and it's not a webbit

    // observe changes to this element so it can be updated
  }

  getName(node) {
    return node.nodeName.toLowerCase();
  }

  getDashboardConfig(node) {
    return getDashboardConfig(this.getName(node));
  }

  getAttributePropertyName(node, attribute) {
    const dashboardConfig = this.getDashboardConfig(node);
    const propertyConfig = dashboardConfig.properties;
    for (let prop in propertyConfig) {
      if (propertyConfig[prop].attribute === attribute) {
        return prop;
      }
    }
    return null;
  }

  attributeToPropertyValue(node, attribute) {
    const dashboardConfig = this.getDashboardConfig(node);
    const propertyConfig = dashboardConfig.properties;
    const propName = this.getAttributePropertyName(node, attribute);
    const property = propertyConfig[propName];

    if (property.type === String) {
      return node.hasAttribute(attribute) ? node.getAttribute(attribute) : property.defaultValue;
    } else if (property.type === Boolean) {
      return node.hasAttribute(attribute);
    } else if (property.type === Number) {
      return node.hasAttribute(attribute) ? parseFloat(node.getAttribute(attribute)) : property.defaultValue;
    } else if (property.type === Array) {
      return node.hasAttribute(attribute) ? JSON.parse(node.getAttribute(attribute)) : property.defaultValue;
    }

    return node.hasAttribute(attribute) ? node.getAttribute(attribute) : property.defaultValue;
  }

  setAttributeFromProperty(node, propertyName) {
    const dashboardConfig = this.getDashboardConfig(node);
    const propertyConfig = dashboardConfig.properties;
    const property = propertyConfig[propertyName];

    if (!property) {
      return null;
    }

    const attribute = property.attribute;
    const propertyValue = node.webbitPropertyValues[propertyName];
    
    if (property.type === Boolean) {
      if (propertyValue) {
        node.setAttribute(attribute, '');
      } else {
        node.removeAttribute(attribute);
      }
    } else if (property.type === Array) {
      if (propertyValue instanceof Array) {
        node.setAttribute(attribute, JSON.stringify(propertyValue));
      }
    }
    
    if (propertyValue === null || propertyValue === undefined || propertyValue.toString === undefined) {
      node.removeAttribute(attribute);
    } else {
      node.setAttribute(attribute, propertyValue.toString());
    }

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