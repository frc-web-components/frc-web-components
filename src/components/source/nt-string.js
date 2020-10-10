import NtEntry from './nt-entry';

class NtString extends NtEntry {

  static get metadata() {
    return {
      displayName: 'NT String',
      category: 'Sources',
      description: `Component to set a NetworkTables entry's value if it hasn't already been set.`,
      // documentationLink: 'https://frc-web-components.github.io/components/networktable-tree/',
      slots: [],
    };
  }

  static get properties() {
    return {
      ...super.properties,
      defaultValue: { type: String },
    };
  }

  constructor() {
    super();
    this.defaultValue = '';
  }
}

webbitRegistry.define('frc-nt-string', NtString);