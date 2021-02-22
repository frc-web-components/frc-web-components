import NtEntryDefault from './nt-entry-default';

class NtStringDefault extends NtEntryDefault {

  static get dashboardConfig() {
    return {
      displayName: 'NT String Default',
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
      value: { type: String, showInEditor: true },
    };
  }

  constructor() {
    super();
    this.value = '';
  }
}

webbitRegistry.define('frc-nt-string-default', NtStringDefault);