import NtEntry from './nt-entry';

class NtBoolean extends NtEntry {

  static get properties() {
    return {
      key: { type: String },
      value: { type: String, reflect: true },
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' }
    };
  }

  set value(value) {
    if (value === 'true') {
      this.hasProvider.then(provider => {
        provider.userUpdate(this.key, true);
      });
    } else if (value === 'false') {
      this.hasProvider.then(provider => {
        provider.userUpdate(this.key, false);
      });
    }
  }

  get value() {
    if (!this.provider) {
      return undefined;
    }
    const value = this.provider.getSource(this.key);
    if (value === true) {
      return 'true';
    } else if (value === false) {
      return 'false';
    }
    return undefined;
  }
}

customElements.define('nt-boolean', NtBoolean);