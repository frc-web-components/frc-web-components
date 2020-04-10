import { LitElement } from '@webbitjs/webbit';
import { getSourceProvider, sourceProviderAdded } from '@webbitjs/store';

export default class NtRobotConnection extends LitElement {

  static get properties() {
    return {
      immediateNotify: { type: Boolean, attribute: 'immediate-notify' },
      connected: { type: Boolean, reflect: true }
    }
  }

  set connected(value) {}
  
  get connected() {
    if (!this.provider) {
      return false;
    }
    return this.provider.isRobotConnected();
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
      provider.addRobotConnectionListener(async (connected) => {
        await this.requestUpdate('value');
        const event = new CustomEvent('change', {
          detail: {
            connected
          }
        });
        this.dispatchEvent(event);
      }, this.immediateNotify);
    });
  }
}

customElements.define('nt-robot-connection', NtRobotConnection);