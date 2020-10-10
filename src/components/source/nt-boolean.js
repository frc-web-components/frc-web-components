import NtEntry from './nt-entry';

class NtBoolean extends NtEntry {

  static get metadata() {
    return {
      displayName: 'NT Boolean',
      category: 'Sources',
      description: `Component to set a NetworkTables entry's value if it hasn't already been set.`,
      // documentationLink: 'https://frc-web-components.github.io/components/networktable-tree/',
      slots: [],
    };
  }

  static get properties() {
    return {
      ...super.properties,
      defaultValue: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.defaultValue = false;
  }
}

webbitRegistry.define('frc-nt-boolean', NtBoolean);