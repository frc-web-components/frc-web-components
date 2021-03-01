
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


const {
  getSource,
  subscribe,
  getDefaultSourceProvider,
  getSourceProvider,
  defaultSourceProviderSet,
} = window.webbitStore;

const camelToKebab = (string) => {
  return string
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase();
};

const isSourceObject = (value) => {
  return (
    value instanceof Object
    && value !== null
    && value.constructor.__WEBBIT_CLASSNAME__ === 'Source'
  );
}

// addExisting('a', {
//   displayName: 'Link',
//   category: 'HTML Elements',
//   description: 'description',
//   properties: {
//     href: { type: String, defaultValue: '', showInEditor: true },
//   },
//   dashboardHtml: `
//     <a href="#"><frc-label text="Label"></frc-label></a>
//   `,
//   resizable: { left: true, right: true },
//   layout: 'none',
// });

export class ManageExistingComponents {


  constructor() {

    // map from html element to config
    this.elements = new Map();

    document.body.querySelectorAll('[source-key]').forEach(childNode => {
      if (!this.isInstanceOfWebbit(childNode)) {
        this.addElement(childNode);
      }
    });

    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          const addedNodes = mutation.addedNodes || [];
          const removedNodes = mutation.removedNodes || [];
          addedNodes.forEach(node => {
            if ('querySelectorAll' in node) {
              if (node.hasAttribute('source-key') && !this.isInstanceOfWebbit(node)) {
                this.addElement(node);
              }

              node.querySelectorAll('[source-key]').forEach(childNode => {
                if (!this.isInstanceOfWebbit(childNode)) {
                  this.addElement(childNode);
                }
              });
            }
          });
          removedNodes.forEach(node => {
            if ('querySelectorAll' in node) {
              if (node.hasAttribute('source-key') && !this.isInstanceOfWebbit(node)) {
                this.removeElement(node);
              }
              node.querySelectorAll('[source-key]').forEach(childNode => {
                if (!this.isInstanceOfWebbit(childNode)) {
                  this.removeElement(childNode);
                }
              });
            }
          });
        } else if (mutation.type === 'attributes') {
          if (!this.isInstanceOfWebbit(mutation.target)) {
            this.addElement(mutation.target);
          }
        }
      }
    });

    observer.observe(window.document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['source-key', 'source-provider']
    });
  }

  isInstanceOfWebbit(element) {
    return element instanceof Object && isInstanceOfWebbit(element.constructor);
  }

  addElement(element) {

    if (this.elements.has(element)) {
      return;
    }

    if (!element.hasAttribute('source-provider') && getDefaultSourceProvider()) {
      element.setAttribute('source-provider', getDefaultSourceProvider());
    }

    const dashboardConfig = this.getDashboardConfig(element);
    
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'attributes') {
          const attribute = mutation.attributeName;

          if (attribute === 'source-key' || attribute === 'source-provider') {
            if (!element.hasAttribute('source-key')) {
              this.removeElement(element);
              return;
            }

            if (!element.hasAttribute('source-provider') && getDefaultSourceProvider()) {
              element.setAttribute('source-provider', getDefaultSourceProvider());
            }

            this.subscribe(element);
          }
        }
      }
    });

    observer.observe(element, {
      attributes: true,
      // attributesFilter: ['source-provider', 'source-key'].concat(Object.keys(propertyConfig))
    });

    const defaultAttributeValues = {};

    element.getAttributeNames().forEach(attribute => {
      defaultAttributeValues[attribute] = element.getAttribute(attribute);
    }); 

    this.elements.set(element, { 
      observer,
      webbitId: '',
      defaultAttributeValues,
      sourceProvider: null,
      sourceKey: null,
      unsubscribe: () => {},
    });

    this.subscribe(element);
  }

  getElement(element) {
    return this.elements.get(element);
  }

  setSources(element) {

  }

  getName(node) {
    return node.nodeName.toLowerCase();
  }

  getDashboardConfig(node) {
    return getDashboardConfig(this.getName(node));
  }

  getPrimaryPropertyName(node) {
    const dashboardConfig = this.getDashboardConfig(node);

    if (!dashboardConfig) {
      return;
    }

    const properties = dashboardConfig.properties;

    for (let propName in properties) {
      if (properties[propName].primary) {
        return propName;
      }
    }

    return null;
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

    if (propName === null) {
      return null;
    }

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
    if (this.elements.has(element)) {
      this.elements.get(element).observer.disconnect();
      this.elements.delete(element);
    }
  }

  subscribe(element) {
    
    const elementObject = this.elements.get(element);
    
    if (!elementObject) {
      return;
    }

    this.unsubscribe(element);

    const sourceProvider = element.getAttribute('source-provider');
    const sourceKey = element.getAttribute('source-key');

    if (!sourceProvider || !sourceKey) {
      return;
    }

    elementObject.sourceProvider = sourceProvider;
    elementObject.sourceKey = sourceKey;

    elementObject.unsubscribe = subscribe(sourceProvider, sourceKey, source => {
      if (isSourceObject(source)) {
        Object.getOwnPropertyNames(source).forEach(prop => {
          const value = source[prop];
          const attribute = camelToKebab(prop);
          if (['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) < 0) {
            this.setAttributeFromSourceValue(element, attribute, value);
          }
        });
      }
    }, true);
  }

  setAttributeFromSourceValue(element, attribute, value) {
    if (typeof value === 'string') {
      element.setAttribute(attribute, value);
    } else if (typeof value === 'number') {
      element.setAttribute(attribute, value);
    } else if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(attribute, '');
      } else {
        element.removeAttribute(attribute);
      }
    } else if (value instanceof Array) {
      element.setAttribute(attribute, JSON.stringify(value));
    }
  }

  setSourceValueFromAttribute(element, attribute) {
    const elementObject = this.elements.get(element);

    if (!elementObject) {
      return;
    }

    let source = getSource(elementObject.sourceProvider, elementObject.sourceKey);
    let sourceKey = null;
    let sourceValue = null;

    if (isSourceObject(source)) {

      const property = Object.getOwnPropertyNames(source).find(prop => {
        return attribute === camelToKebab(prop);
      });

      if (property) {
        sourceKey = `${elementObject.sourceKey}/${property}`;
        sourceValue = source[property];
      }
    } else {
      const primaryPropertyName = this.getPrimaryPropertyName(element);

      if (primaryPropertyName && attribute === camelToKebab(primaryPropertyName)) {
        sourceKey = elementObject.sourceKey;
        sourceValue = source;
      }
    }

    if (sourceKey === null) {
      return;
    }

    let newSourceValue = null;

    if (typeof sourceValue === 'string') {
      newSourceValue = element.getAttribute(attribute);
    } else if (typeof value === 'number') {
      const newValue = parseFloat(element.getAttribute(attribute));
      if (!isNaN(newValue)) {
        newSourceValue = newValue;
      }
    } else if (typeof value === 'boolean') {
      newSourceValue = element.hasAttribute(attribute);
    } else if (value instanceof Array) {
      try {
        const array = JSON.parse(element.getAttribute(attribute));
        if (array instanceof Array) {
          newSourceValue = array;
        }
      } catch(e) {}
    }

    if (newSourceValue !== null) {
      const sourceProvider = getSourceProvider(elementObject.sourceProvider);
      if (sourceProvider) {
        sourceProvider.userUpdate(sourceKey, newSourceValue);
      }
    }
  }

  unsubscribe(element) {
    const elementObject = this.elements.get(element);
  
    if (elementObject) {
      elementObject.sourceProvider = null;
      elementObject.sourceKey = null;
      elementObject.unsubscribe();
    }
  }
}

// window.manageExistingComponents = new ManageExistingComponents();


// addExisting('img', {
//   displayName: 'Image',
//   category: 'HTML Elements',
// });