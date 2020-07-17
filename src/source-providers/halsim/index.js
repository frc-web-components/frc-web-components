import { SourceProvider, addSourceProviderType } from '@webbitjs/store';
import { createSocket, sendMsg } from './socket';

export default class HalSimProvider extends SourceProvider {

  static get typeName() {
    return 'HALSim';
  }

  static get settingsDefaults() {
    return {};
  }

  constructor(providerName, settings) {
    super(providerName, settings);
    createSocket(data => {
      Object.entries(data).forEach(([deviceId, simObject]) => {
        Object.entries(simObject).forEach(([simKey, value]) => {
          const key = `${deviceId}/${simKey}`;
          this.updateSource(key, value);
        });
      });
    });
  }

  userUpdate(key, value) {

  }
}

addSourceProviderType(HalSimProvider);
