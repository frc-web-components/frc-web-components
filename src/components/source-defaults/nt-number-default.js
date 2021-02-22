import NtEntryDefault from './nt-entry-default';

class NtNumberDefault extends NtEntryDefault {

  static get dashboardConfig() {
    return {
      displayName: 'NT Number Default',
      category: 'Sources',
      description: `Component to set a NetworkTables entry's value if it hasn't already been set.`,
      // documentationLink: 'https://frc-web-components.github.io/components/networktable-tree/',
      slots: [],
      allowedParents: ['frc-root-layout'],
      movable: false,
      resizable: { left: false, right: false, top: false, bottom: false },
      editorTabs: ['properties']
    };
  }

  static get properties() {
    return {
      ...super.properties,
      value: { type: Number, showInEditor: true },
    };
  }

  constructor() {
    super();
    this.value = 0;
  }
}

webbitRegistry.define('frc-nt-number-default', NtNumberDefault);