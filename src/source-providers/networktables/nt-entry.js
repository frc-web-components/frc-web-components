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
      provider.subscribe(this.key, async (value) => {
        await this.requestUpdate('value');
        const event = new CustomEvent('update', {
          detail: {
            key: this.key,
            value
          }
        });
        this.dispatchEvent(event);
      }, true);
    });
  }
}