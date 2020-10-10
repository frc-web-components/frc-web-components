import NtEntry from './nt-entry';

function isNumberArray(value) {
  if (value instanceof Array) {
    for (let element of value) {
      if (typeof element !== 'number') {
        return false;
      }
    }
    return true;
  }
  return false;
}

class NtNumberArray extends NtEntry {

  static get metadata() {
    return {
      displayName: 'NT Number Array',
      category: 'Sources',
      description: `Component to set a NetworkTables entry's value if it hasn't already been set.`,
      // documentationLink: 'https://frc-web-components.github.io/components/networktable-tree/',
      slots: [],
    };
  }

  static get properties() {
    return {
      ...super.properties,
      defaultValue: { 
        type: Array,
        inputType: 'NumberArray',
        set(value) {
          return isNumberArray(value) ? value : [];
        }
      },
    };
  }

  constructor() {
    super();
    this.defaultValue = [];
  }
}

webbitRegistry.define('frc-nt-number-array', NtNumberArray);