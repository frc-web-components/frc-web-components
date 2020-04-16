import { LitElement } from '@webbitjs/webbit';
import { getSourceProvider, sourceProviderAdded } from '@webbitjs/store';

export default class NtGlobalListener extends LitElement {

  static get properties() {
    return {
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' }
    };
  }

  constructor() {
    super();
    this.provider = null;
    this.hasProvider = new Promise(resolve => {
      sourceProviderAdded(providerName => {
        if (providerName === 'NetworkTables') {
          this.provider = getSourceProvider('NetworkTables');
          resolve(this.provider);
        }
      });
    });

    this.hasProvider.then(provider => {
      provider.subscribeAll((value, key) => {
        if (value instanceof Object && value.constructor !== Array) {
          return;
        }
        this.dispatchChangeEvent(key, value);
      }, this.immediateNotify);
    });
  }

  dispatchChangeEvent(key, value) {
    this.key = key;
    this.value = value;

    const event = new CustomEvent('change', {
      detail: {
        key,
        value
      }
    });
    this.dispatchEvent(event);
  }
}

customElements.define('nt-global-listener', NtGlobalListener);