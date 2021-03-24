
const {
  isInstanceOfWebbit,
  getDashboardConfig,
  addExisting,
  getRegisteredNames,
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

addExisting('a', {
  displayName: 'Link',
  category: 'HTML Elements',
  description: 'description',
  properties: {
    href: { type: String, defaultValue: '', showInEditor: true, primary: true },
  },
  dashboardHtml: `
    <a href="#"><frc-label text="Label"></frc-label></a>
  `,
  resizable: { left: true, right: true },
  layout: 'none',
});


export const setAttributeFromSourceValue = (element, attribute, value) => {
  if (typeof value === 'string') {
    element.setAttribute(attribute, value);
  } else if (typeof value === 'number') {
    if (isNaN(value)) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, value);
    }
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

export const getValueType = (value) => {
  if (typeof value === 'string') {
    return String;
  } else if (typeof value === 'number') {
    return Number;
  } else if (typeof value === 'boolean') {
    return Boolean;
  } else if (value instanceof Array) {
    return Array;
  } 
  return null;
}

const getDefaultSource = (elementName) => {
  const dashboardConfig = getDashboardConfig(elementName) || {};
  return { 
    sourceKey: dashboardConfig.defaultSourceKey,
    sourceProvider: dashboardConfig.defaultSourceProvider,
  };
};


export class ManageExistingComponents {


  constructor() {

    // map from html element to config
    this.elements = new Map();

    defaultSourceProviderSet(sourceProvider => {
      this.elements.forEach((elementObject, element) => {
        if (elementObject.sourceProvider === null) {
          this.setSourceProvider(element, sourceProvider);
        }
      });
    });

    document.body.querySelectorAll('[source-key]').forEach(childNode => {
      if (!this.isInstanceOfWebbit(childNode)) {
        this.addElement(childNode);
      }
    });

    getRegisteredNames().forEach(name => {
      const { sourceKey } = getDefaultSource(name);
      if (sourceKey) {
        document.body.querySelectorAll(name).forEach(childNode => {
          if (!this.isInstanceOfWebbit(childNode)) {
            this.addElement(childNode);
          }
        });
      }
    });

    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          const addedNodes = mutation.addedNodes || [];
          const removedNodes = mutation.removedNodes || [];
          addedNodes.forEach(node => {
            if ('querySelectorAll' in node) {              
              if (
                (node.hasAttribute('source-key') || getDefaultSource(node.nodeName.toLowerCase()).sourceKey)
                && !this.isInstanceOfWebbit(node)
              ) {
                this.addElement(node);
              }

              node.querySelectorAll('[source-key]').forEach(childNode => {
                if (!this.isInstanceOfWebbit(childNode)) {
                  this.addElement(childNode);
                }
              });

              getRegisteredNames().forEach(name => {
                const { sourceKey } = getDefaultSource(name);
                if (sourceKey) {
                  node.querySelectorAll(name).forEach(childNode => {
                    if (!this.isInstanceOfWebbit(childNode)) {
                      this.addElement(childNode);
                    }
                  });
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

    const dashboardConfig = this.getDashboardConfig(element) || {};

    if (!element.hasAttribute('source-provider')) {
      const sourceProvider =  dashboardConfig.defaultSourceProvider || getDefaultSourceProvider();
      if (sourceProvider) {
        element.setAttribute('source-provider', sourceProvider);
      }
    }

    if (!element.hasAttribute('source-key') && dashboardConfig.defaultSourceKey) {
      element.setAttribute('source-key', dashboardConfig.defaultSourceKey);
    }

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
          } else {
            this.setSourceValueFromAttribute(element, attribute);
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
      if (['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) < 0) {
        defaultAttributeValues[attribute] = element.getAttribute(attribute);
      }
    });

    this.elements.set(element, {
      observer,
      defaultAttributeValues,
      sourceProvider: null,
      sourceKey: null,
      unsubscribe: () => { },
    });

    this.subscribe(element);
  }

  setDefaultAttributeValue(element, attribute, value) {
    const elementObject = this.getElement(element);

    if (elementObject) {
      elementObject.defaultAttributeValues[attribute] = value;
    }
  }

  setSourceProvider(element, sourceProvider) {
    const elementObject = this.getElement(element);

    if (elementObject) {
      element.setAttribute('source-provider', sourceProvider);
    }
  }

  setSourceKey(element, sourceKey) {
    const elementObject = this.getElement(element);

    if (elementObject) {
      element.setAttribute('source-key', sourceKey);
    }
  }

  getDefaultAttributeValue(element, attribute) {
    const elementObject = this.getElement(element);
    return elementObject
      ? elementObject.defaultAttributeValues[attribute]
      : null;
  }

  getDefaultAttributeValues(element) {
    const elementObject = this.getElement(element);
    return elementObject ? elementObject.defaultAttributeValues : {};
  }

  getSourceProvider(element) {
    const elementObject = this.getElement(element);
    return elementObject ? elementObject.sourceProvider : getDefaultSourceProvider();
  }

  getSourceKey(element) {
    const elementObject = this.getElement(element);
    return elementObject ? elementObject.sourceKey : null;
  }

  getElement(element) {
    return this.elements.get(element);
  }

  hasElement(element) {
    return this.elements.has(element);
  }

  isAttributeConnectedToSource(element, attribute) {
    const elementObject = this.getElement(element);
    if (!elementObject) {
      return false;
    }
    const source = getSource(elementObject.sourceProvider, elementObject.sourceKey);

    if (typeof source === 'undefined') {
      return false;
    }

    if (isSourceObject(source)) {
      for (let property of Object.getOwnPropertyNames(source)) {
        if (camelToKebab(property) === attribute) {
          return true;
        }
      }
      return false;
    }
    
    const primaryPropertyName = this.getPrimaryPropertyName(element);

    if (primaryPropertyName === null) {
      return false;
    }
    
    const primaryProperty = this.getProperty(element, primaryPropertyName);
    return primaryProperty.attribute === attribute;
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
      return null;
    }

    const properties = dashboardConfig.properties;

    for (let propName in properties) {
      if (properties[propName].primary) {
        return propName;
      }
    }

    return null;
  }

  getProperty(node, propertyName) {
    const dashboardConfig = this.getDashboardConfig(node);

    if (!dashboardConfig) {
      return null;
    }

    return dashboardConfig.properties[propertyName];
  }

  getPropertyByAttribute(node, attribute) {
    const dashboardConfig = this.getDashboardConfig(node);

    if (!dashboardConfig) {
      return null;
    }

    for (let propName in dashboardConfig.properties) {
      const property = dashboardConfig.properties[propName];
      if (property.attribute === attribute) {
        return propName;
      }
    }

    return null;
  }

  removeElement(element) {
    if (this.elements.has(element)) {
      const elementObject = this.elements.get(element);
      elementObject.observer.disconnect();
      this.unsubscribe(element);
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

    elementObject.unsubscribe = subscribe(sourceProvider, sourceKey, (source, parentKey, key) => {
      
      if (typeof source === 'undefined') { // source has been removed, so set attributes to defaults

        const defaultAttributeValues = elementObject.defaultAttributeValues;
        const currentAttributes = element.getAttributeNames().filter(attribute => {
          return ['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) < 0;
        });
        Object.entries(defaultAttributeValues).forEach(([attribute, value]) => {
          element.setAttribute(attribute, value);
        });

        currentAttributes.forEach(attribute => {
          if (typeof defaultAttributeValues[attribute] === 'undefined') {
            element.removeAttribute(attribute);
          }
        });

      } else if (isSourceObject(source)) { // If its a source object set attributes from props


        // if parentKey and key are equal, map all props to attributes
        if (parentKey === key) {
          Object.getOwnPropertyNames(source).forEach(prop => {
            const value = source[prop];
            const attribute = camelToKebab(prop);
            if (['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) < 0) {
              setAttributeFromSourceValue(element, attribute, value);
            }
          }); 
        }

        const prop = key.replace(parentKey + '/', '');

        // If prop contains a / that means a direct child of the source hasn't change, so don't update
        if (prop.indexOf('/') > -1) {
          return;
        }

        const value = source[prop];
        const attribute = camelToKebab(prop);

        // Don't allow source to modify one of these attributes
        if (['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) > -1) {
          return;
        }

        // source has been removed, so set attribute to its default value
        if (typeof value === 'undefined') {

          const defaultAttributeValues = elementObject.defaultAttributeValues;

          if (attribute in defaultAttributeValues) {
            element.setAttribute(attribute, defaultAttributeValues[attribute]);
          } else {
            element.removeAttribute(attribute);
          }
        } else {
          if (['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) < 0) {
            setAttributeFromSourceValue(element, attribute, value);
          }
        }

      } else { // See if a primary attribute exists. If it does set primary attribute to the source value

        const primaryPropertyName = this.getPrimaryPropertyName(element);

        if (primaryPropertyName) {
          const primaryProperty = this.getProperty(element, primaryPropertyName);
          setAttributeFromSourceValue(element, primaryProperty.attribute, source);
        }
      }
    }, true);
  }

  setSourceValueFromAttribute(element, attribute) {
    const elementObject = this.elements.get(element);

    if (!elementObject) {
      return;
    }

    let source = getSource(elementObject.sourceProvider, elementObject.sourceKey);
    let sourceKey = null;
    let sourceType = null;
    let addSource = false;

    if (isSourceObject(source)) {

      const property = Object.getOwnPropertyNames(source).find(prop => {
        return attribute === camelToKebab(prop);
      });

      if (property) {
        sourceKey = `${elementObject.sourceKey}/${property}`;
        sourceType = getValueType(source[property]);
      } else {
        const propName = this.getPropertyByAttribute(element, attribute);
        const propConfig = this.getProperty(element, propName);
        if (propConfig && propConfig.addSource) {
          sourceKey = elementObject.sourceKey;
          sourceType = propConfig.type;
          addSource = true;
        }
      }
    } else {
      const primaryPropertyName = this.getPrimaryPropertyName(element);

      if (primaryPropertyName && attribute === camelToKebab(primaryPropertyName)) {
        sourceKey = elementObject.sourceKey;
        sourceType = getValueType(source);
      }
    }


    if (sourceKey === null || sourceType === null) {
      return;
    }

    let newSourceValue = null;

    if (sourceType === String) {
      newSourceValue = element.getAttribute(attribute);
    } else if (sourceType === Number) {
      const newValue = parseFloat(element.getAttribute(attribute));
      if (!isNaN(newValue)) {
        newSourceValue = newValue;
      }
    } else if (sourceType === Boolean) {
      newSourceValue = element.hasAttribute(attribute);
    } else if (sourceType === Array) {
      try {
        const array = JSON.parse(element.getAttribute(attribute));
        if (array instanceof Array) {
          newSourceValue = array;
        }
      } catch (e) { }
    }

    if (newSourceValue !== null) {
      const sourceProvider = getSourceProvider(elementObject.sourceProvider);
      if (sourceProvider) {
        const rawSource = sourceProvider.getRawSource(sourceKey);

        if (rawSource && rawSource.__key__) {
          if (!addSource) {
            sourceProvider.userUpdate(rawSource.__key__, newSourceValue);
          } else {
            const propName = this.getPropertyByAttribute(element, attribute);
            sourceProvider.userUpdate(`${rawSource.__key__}/${propName}`, newSourceValue); 
          }
        }
      }
    }
  }

  unsubscribe(element) {
    const elementObject = this.elements.get(element);

    if (elementObject) {
      const defaultAttributeValues = elementObject.defaultAttributeValues;
      const currentAttributes = element.getAttributeNames().filter(attribute => {
        return ['source-provider', 'source-key', 'webbit-id'].indexOf(attribute) < 0;
      });
      Object.entries(defaultAttributeValues).forEach(([attribute, value]) => {
        element.setAttribute(attribute, value);
      });

      currentAttributes.forEach(attribute => {
        if (typeof defaultAttributeValues[attribute] === 'undefined') {
          element.removeAttribute(attribute);
        }
      });
      elementObject.sourceProvider = null;
      elementObject.sourceKey = null;
      elementObject.unsubscribe();
    }
  }
}

window.manageExistingComponents = new ManageExistingComponents();


addExisting('img', {
  displayName: 'Image',
  category: 'HTML Elements',
});