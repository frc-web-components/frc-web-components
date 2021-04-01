
import { SourceProvider, addSourceProviderType } from '@webbitjs/store';
import './nt-boolean';
import './nt-number';
import './nt-string';
import './nt-boolean-array';
import './nt-number-array';
import './nt-string-array';
import './nt-robot-connection';
import './nt-global-listener';
import './networktables';

const getType = (value) => {
  if (['number', 'boolean', 'string'].includes(typeof value)) {
    return typeof value;
  }
  if (value instanceof Array) {
    const [element] = value;
    if (['number', 'boolean', 'string'].includes(typeof element)) {
      return `${typeof element}Array`;
    } else {
      return 'Array';
    }
  }
  return '';
};

export default class NetworkTablesProvider extends SourceProvider {

	static get typeName() {
    return 'NetworkTables';
  }

  static get settingsDefaults() {
    return {
      address: 'localhost'
    };
  }

  constructor(providerName, settings) {
    super(providerName, settings);
    this.setAddress(settings.address);
    this.updatedEntriesBeforeReady = [];
    this.isNtReady = false;
    this.ntReady = new Promise(resolve => {
      const interval = setInterval(() => {
        if (NetworkTables.isWsConnected()) {
          this.isNtReady = true;
          resolve();
          clearInterval(interval);
        }
      }, 500);
    });
    
    this.ntReady.then(() => {
      this.updatedEntriesBeforeReady.forEach(key => {
        if (typeof NetworkTables.getValue(key) === 'undefined') {
          NetworkTables.putValue(key, this.getSource(key));
        }
      });
  
      NetworkTables.addRobotConnectionListener(connected => {
        if (!connected) {
          this.clearSourcesWithTimeout(2000, this.updateAll.bind(this));
        } else {
          this.clearSources(this.updateAll.bind(this));
        }
      }, true);

      NetworkTables.addWsConnectionListener(connected => {
        if (!connected) {
          this.clearSourcesWithTimeout(2000, this.updateAll.bind(this));
        } else {
          this.clearSources(this.updateAll.bind(this));
          this.connect();
        }
      }, true);
  
      NetworkTables.addGlobalListener((key, value) => {
        this.updateSource(key, value);
      }, true);
    });
  }

  updateAll() {
    for (let key of NetworkTables.getKeys()) {
      this.updateSource(key, NetworkTables.getValue(key));
    }
  }

  setAddress(address) {
    if (address === 'gitpod') {
      const addressPart = window.location.href.substring(12, window.location.href.length - 1);
      NetworkTables.connectToWs(`8888${addressPart}`);
    } else {
      NetworkTables.connectToWs(`${address}:8888`);
    }
  }

  connect(address) {
    if (address) {
      localStorage.networkTablesAddress = address === 'localhost' ? '127.0.0.1' : address;
    }

    if (localStorage.networkTablesAddress) {
      NetworkTables.connect(localStorage.networkTablesAddress);
    }
  }

  userUpdate(key, value) {
    if (this.isNtReady) {
      NetworkTables.putValue(key, value);
    } else {
      const currentValue = this.getSource(key);
      const currentType = getType(currentValue);
      const updatedType = getType(value);
      
      // put in if it's new and it's valid
      if (!currentType && updatedType) {
        this.updateSource(key, value);
        if (!this.updatedEntriesBeforeReady.includes(key)) {
          this.updatedEntriesBeforeReady.push(key);
        }
      }

      // Don't update if type isn't valid
      if (!updatedType) {
        return;
      }

      // make sure current value type matches value passed in
      if (
        currentType === updatedType
        || currentType.includes('Array') && updatedType === 'Array'
        || currentType === 'Array' && updatedType.includes('Array')
      ) {
        this.updateSource(key, value);
        if (!this.updatedEntriesBeforeReady.includes(key)) {
          this.updatedEntriesBeforeReady.push(key);
        }
      }
    }
  }

  isRobotConnected() {
    if (this.isNtReady) {
      return NetworkTables.isRobotConnected();
    }
    return false;
  }

  isWsConnected() {
    return NetworkTables.isWsConnected();
  }

  async addWsConnectionListener(listener, immediateNotify) {
    if (this.isNtReady) {
      NetworkTables.addWsConnectionListener(listener, immediateNotify);
    } else {
      // No NetworkTables, so can't be connected to robot
      if (immediateNotify) {
        listener(false);
      }
      await this.ntReady;
      // Listener has already been notified, so don't immediately notify.
      // Only send a notification if connection has changed (from false to true)
      NetworkTables.addWsConnectionListener(listener, false);
      if (immediateNotify && NetworkTables.isWsConnected()) {
        listener(true);
      }
    }
  }


  async addRobotConnectionListener(listener, immediateNotify) {
    if (this.isNtReady) {
      NetworkTables.addRobotConnectionListener(listener, immediateNotify);
    } else {
      // No NetworkTables, so can't be connected to robot
      if (immediateNotify) {
        listener(false);
      }
      await this.ntReady;
      // Listener has already been notified, so don't immediately notify.
      // Only send a notification if connection has changed (from false to true)
      NetworkTables.addRobotConnectionListener(listener, false);
      if (immediateNotify && NetworkTables.isRobotConnected()) {
        listener(true);
      }
    }
  }
}

addSourceProviderType(NetworkTablesProvider);
