import NtEntry from './nt-entry';

class NtNumber extends NtEntry {

  static get properties() {
    return {
      key: { type: String },
      value: { type: Number, reflect: true },
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' }
    };
  }

  set value(value) {
    if (typeof value === 'number' && value !== Infinity && !isNaN(value)) {
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
    return typeof value === 'number' ? value : undefined;
  }
}

customElements.define('nt-number', NtNumber);