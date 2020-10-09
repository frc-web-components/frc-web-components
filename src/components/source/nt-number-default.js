import NtEntryDefault from './nt-entry-default';

class NtNumberDefault extends NtEntryDefault {

  static get metadata() {
    return {
      displayName: 'NT Number Default',
      category: 'Sources',
      description: `Component to set a NetworkTables entry's value if it hasn't already been set.`,
      // documentationLink: 'https://frc-web-components.github.io/components/networktable-tree/',
      slots: [],
    };
  }

  static get properties() {
    return {
      ...super.properties,
      defaultValue: { type: Number },
    };
  }

  constructor() {
    super();
    this.defaultValue = 0;
  }
}

webbitRegistry.define('nt-number-default', NtNumberDefault);