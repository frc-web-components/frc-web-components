import NtEntry from './nt-entry';

class NtNumber extends NtEntry {

  static get metadata() {
    return {
      displayName: 'NT Number',
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

webbitRegistry.define('frc-nt-number', NtNumber);