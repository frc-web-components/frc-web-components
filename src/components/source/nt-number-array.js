import NtEntry from './nt-entry';

class NtNumberArray extends NtEntry {

  static get properties() {
    return {
      key: { type: String },
      value: { type: Array, reflect: true },
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' }
    };
  }

  isNumberArray(value) {
    if (value instanceof Array) {
      for (let element of value) {
        if (typeof element !== 'number' || element === Infinity || isNaN(element)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  set value(value) {
    if (this.isNumberArray(value)) {
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
    return this.isNumberArray(value) ? value : undefined;
  }
}

customElements.define('nt-number-array', NtNumberArray);