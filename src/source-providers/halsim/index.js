import { SourceProvider, addSourceProviderType } from '@webbitjs/store';
import { createSocket, sendMsg } from './socket';

// https://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
const deepExtend = (destination, source) => {
  for (let property in source) {
    if (source[property] instanceof Array) {
      destination[property] = source[property];
    } else if (typeof source[property] === "object") {
      destination[property] = destination[property] || {};
      deepExtend(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

export default class HalSimProvider extends SourceProvider {

  static get typeName() {
    return 'HALSim';
  }

  static get settingsDefaults() {
    return {};
  }

  constructor(providerName, settings) {
    super(providerName, settings);
    this.parentKeyMap = {};
    this.dataToSend = {};
    createSocket(
      data => {
        this.socketUpdate(data);
      },
      () => {
        this.clearSources();
      },
    );
    // Send data every 50ms
    setInterval(() => {
      if (Object.keys(this.dataToSend).length > 0) {
        sendMsg(this.dataToSend);
        this.dataToSend = {};
      }
    }, 50);
  }

  socketUpdate(data, parentKeys = []) {
    Object.entries(data).forEach(([keyPart, value]) => {
      const keys = parentKeys.concat(keyPart);
      if (keyPart.indexOf('<') >= 0 || keyPart.indexOf('>') >= 0) {
        const key = keys.join('/');
        this.parentKeyMap[key] = keys;
        this.updateSource(key, value);
      } else {
        this.socketUpdate(value, keys);
      }
    });
  }

  userUpdate(key, value) {
    const parentKeys = [...this.parentKeyMap[key]];
    let data = {
      [parentKeys.pop()]: value
    };
    parentKeys.reverse().forEach(key => {
      data = {
        [key]: data
      };
    });
    deepExtend(this.dataToSend, data);
  }
}

addSourceProviderType(HalSimProvider);
