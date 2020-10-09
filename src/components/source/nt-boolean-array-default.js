import NtEntryDefault from './nt-entry-default';

function isBooleanArray(value) {
  if (value instanceof Array) {
    for (let element of value) {
      if (typeof element !== 'boolean') {
        return false;
      }
    }
    return true;
  }
  return false;
}

class NtBooleanArrayDefault extends NtEntryDefault {

  static get metadata() {
    return {
      displayName: 'NT Boolean Array Default',
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
        inputType: 'BooleanArray',
        set(value) {
          return isBooleanArray(value) ? value : [];
        }
      },
    };
  }

  constructor() {
    super();
    this.defaultValue = [];
  }

  getAllValues() {
    return [];
  }
}

webbitRegistry.define('nt-boolean-array-default', NtBooleanArrayDefault);