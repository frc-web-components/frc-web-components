import NtEntry from './nt-entry';

function isStringArray(value) {
  if (value instanceof Array) {
    for (let element of value) {
      if (typeof element !== 'string') {
        return false;
      }
    }
    return true;
  }
  return false;
}

class NtStringArray extends NtEntry {

  static get metadata() {
    return {
      displayName: 'NT String Array',
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
        inputType: 'StringArray',
        set(value) {
          return isStringArray(value) ? value : [];
        }
      },
    };
  }

  constructor() {
    super();
    this.defaultValue = [];
  }
}

webbitRegistry.define('frc-nt-string-array', NtStringArray);