import NtEntryDefault from './nt-entry-default';

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

class NtStringArrayDefault extends NtEntryDefault {

  static get dashboardConfig() {
    return {
      displayName: 'NT String Array Default',
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
        inputType: 'StringArray',
        set(value) {
          return isStringArray(value) ? value : [];
        }
      },
    };
  }

  constructor() {
    super();
    this.value = [];
  }
}

webbitRegistry.define('frc-nt-string-array-default', NtStringArrayDefault);