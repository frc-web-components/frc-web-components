import { LitElement } from 'lit-element';
import ResizeObserver from 'resize-observer-polyfill';

const camelToKebab = (string) => {
  return string
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase();
};


export const define = (name, constructor, options) => {

  if (customElements.get(name)) {
    return;
  }

  const properties = constructor.properties || {};
  for (const propName in properties) {
    const prop = properties[propName];

    if (typeof prop.attribute === 'undefined') {
      prop.attribute = camelToKebab(propName);
    }

    if (typeof prop.reflect === 'undefined') {
      prop.reflect = true;
    }

    prop.canConnectToSources = !!prop.attribute;

    if (typeof prop.inputType === 'undefined') {
      prop.inputType = prop.type.name;
    }

    if (typeof prop.showInEditor === 'undefined') {
      prop.showInEditor = false;
    }

    prop.property = propName;
    prop.event = `${propName}Change`;
  }

  Object.defineProperty(constructor, 'properties', {
    get() {
      return {
        name: {
          type: String,
          inputType: 'String',
          defaultValue: '',
          attribute: 'name',
          showInEditor: true,
          editorOnly: true,
          canConnectToSources: true,
          property: 'name',
          event: 'nameChange'
        },
        ...properties,
      }
    }
  });

  customElements.define(name, constructor, options);
  webbitRegistry.addExisting(name, {
    ...constructor.dashboardConfig,
    properties: constructor.properties
  });
}

export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

const getPropertyValue = ({ type, defaultValue, property }, value) => {

  if (
    type === String && typeof value === 'string'
    || type === Number && isNumber(value)
    || type === Array && value instanceof Array
  ) {
    return value;
  }

  if (type === Boolean) {
    return !!value;
  }

  if (typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  switch (type) {
    case String: return '';
    case Number: return 0;
    case Array: return [];
    default: return value;
  }
};

export class Webbit extends LitElement {

  constructor() {
    super();

    for (let name in this.constructor.properties) {
      const property = this.constructor.properties[name];


      const { attribute, reflect, event, defaultValue } = property;

      if (attribute === false || !reflect) {
        continue;
      }

      Object.defineProperty(this, name, {
        get() {
          const getter = this.constructor.properties[name].get;
          const propertyValue = getPropertyValue(property, this[`_${name}`]);
          if (typeof getter === 'function') {
            return getter.bind(this)();
          }
          return propertyValue;
        },
        set(value) {
          const setter = this.constructor.properties[name].set;
          const oldPropertyValue = getPropertyValue(property, this[`_${name}`]);
          const newPropertyValue = getPropertyValue(property, value);
          this[`_${name}`] = typeof setter === 'function' 
            ? setter.bind(this)(newPropertyValue)
            : newPropertyValue;
          this.requestUpdate(name, oldPropertyValue);

          if (event) {
            this._dispatchPropertyChange(event);
          }
        }
      });

      this[name] = getPropertyValue(property, defaultValue);
    }

    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);

  }

  _dispatchPropertyChange(eventName) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }


  resized() {}
}
