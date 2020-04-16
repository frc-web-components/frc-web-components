import NtEntry from './nt-entry';

class NtString extends NtEntry {

  static get properties() {
    return {
      key: { type: String },
      value: { type: String, reflect: true },
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' }
    };
  }

  set value(value) {
    if (typeof value === 'string') {
      this.hasProvider.then(provider => {
        provider.userUpdate(this.key, value);
      });
    }
  }

  get value() {
    if (!this.provider) {
      return undefined;
    }

    const value = this.provider.getSource(this.key);
    return typeof value === 'string' ? value : undefined;
  }
}

customElements.define('nt-string', NtString);