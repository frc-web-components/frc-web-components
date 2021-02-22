import NtEntryDefault from './nt-entry-default';

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

class NtNumberArrayDefault extends NtEntryDefault {

  static get dashboardConfig() {
    return {
      displayName: 'NT Number Array Default',
      category: 'Sources',
      description: `Component to set a NetworkTables entry's value if it hasn't already been set.`,
      // documentationLink: 'https://frc-web-components.github.io/components/networktable-tree/',
      slots: [],
      allowedParents: ['frc-root-layout'],
      movable: false,
      resizable: { left: false, right: false, top: false, bottom: false },
      editorTabs: ['properties'],
      previewable: false,
    };
  }

  static get properties() {
    return {
      ...super.properties,
      value: { 
        type: Array,
        showInEditor: true,
        inputType: 'NumberArray',
        set(value) {
          return isNumberArray(value) ? value : [];
        }
      },
    };
  }

  constructor() {
    super();
    this.value = [];
  }
}

webbitRegistry.define('frc-nt-number-array-default', NtNumberArrayDefault);