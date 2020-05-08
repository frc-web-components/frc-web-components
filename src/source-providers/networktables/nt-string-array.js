import NtEntry from './nt-entry';

class NtStringArray extends NtEntry {

  static get properties() {
    return {
      key: { type: String },
      value: { type: Array, reflect: true },
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' }
    };
  }

  isStringArray(value) {
    if (value instanceof Array) {
      for (let element of value) {
        if (typeof element !== 'string') {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  set value(value) {
    if (this.isStringArray(value)) {
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
    return this.isStringArray(value) ? value : undefined;
  }
}

customElements.define('nt-string-array', NtStringArray);