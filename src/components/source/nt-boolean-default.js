import NtEntryDefault from './nt-entry-default';

class NtBooleanDefault extends NtEntryDefault {

  static get metadata() {
    return {
      displayName: 'NT Boolean Default',
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

webbitRegistry.define('nt-boolean-default', NtBooleanDefault);