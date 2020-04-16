import { LitElement } from '@webbitjs/webbit';
import { getSourceProvider, sourceProviderAdded } from '@webbitjs/store';

export default class NtEntry extends LitElement {

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

      if (this.immediateNotify) {
        const value = provider.getSource(this.key);
        if (value !== undefined) {
          this.dispatchChangeEvent(value);
        }
      }

      provider.subscribe(this.key, async (value) => {
        await this.requestUpdate('value');
        this.dispatchChangeEvent(value);
      }, true);
    });
  }

  dispatchChangeEvent(value) {
    const event = new CustomEvent('change', {
      detail: {
        key: this.key,
        value
      }
    });
    this.dispatchEvent(event);
  }
}